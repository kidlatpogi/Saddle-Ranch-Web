<?php

namespace App\Services;

class ProfanityFilterService
{
    protected array $dictionary;
    protected array $allProfanities = [];
    protected array $allPornSites = [];

    public function __construct()
    {
        $path = config_path('profanity_dictionary.json');
        if (file_exists($path)) {
            $json = json_decode(file_get_contents($path), true) ?: [];
            $this->dictionary = $json;
        } else {
            $this->dictionary = [];
        }

        $this->allProfanities = array_unique(array_merge(
            $this->dictionary['english_curse_words'] ?? [],
            $this->dictionary['tagalog_curse_words'] ?? [],
            $this->dictionary['english_offensive_vulgar'] ?? [],
            $this->dictionary['tagalog_offensive_vulgar'] ?? []
        ));

        $this->allPornSites = array_unique(array_merge(
            $this->dictionary['english_porn_sites'] ?? [],
            $this->dictionary['tagalog_porn_sites'] ?? []
        ));
    }

    /**
     * Build fuzzy regex pattern to capture leetspeak and punctuated variations (e.g. f.u.c.k, g@go, 5h1t)
     */
    protected function buildFuzzyPattern(string $term): string
    {
        $charMap = [
            'a' => '[a@4^]',
            'b' => '[b8]',
            'c' => '[c(]',
            'd' => '[d]',
            'e' => '[e3]',
            'f' => '[f]',
            'g' => '[g9]',
            'h' => '[h]',
            'i' => '[i1!|l]',
            'j' => '[j]',
            'k' => '[k]',
            'l' => '[l1|]',
            'm' => '[m]',
            'n' => '[n]',
            'o' => '[o0]',
            'p' => '[p]',
            'q' => '[q]',
            'r' => '[r]',
            's' => '[s5$]',
            't' => '[t7+]',
            'u' => '[uv]',
            'v' => '[vu]',
            'w' => '[w]',
            'x' => '[x]',
            'y' => '[y]',
            'z' => '[z2]',
            ' ' => '\s+',
        ];

        $chars = preg_split('//u', strtolower($term), -1, PREG_SPLIT_NO_EMPTY);
        $patternParts = [];
        foreach ($chars as $ch) {
            $patternParts[] = $charMap[$ch] ?? preg_quote($ch, '/');
        }

        return '/\b' . implode('[\s._\-*~]*', $patternParts) . '\b/iu';
    }

    /**
     * Normalize text for pre-processing:
     * - Lowercases text
     * - Translates leetspeak characters
     * - Removes intra-word delimiters (e.g. f.u.c.k -> fuck)
     */
    public function normalize(string $text): string
    {
        $normalized = mb_strtolower($text, 'UTF-8');

        $leetMap = [
            '@' => 'a',
            '4' => 'a',
            '0' => 'o',
            '1' => 'i',
            '!' => 'i',
            '|' => 'i',
            '3' => 'e',
            '5' => 's',
            '$' => 's',
            '7' => 't',
            '+' => 't',
            '8' => 'b',
            '9' => 'g',
        ];

        $normalized = strtr($normalized, $leetMap);
        $collapsed = preg_replace('/(?<=\b[a-z])[\s._\-*~]+(?=[a-z]\b)/i', '', $normalized);

        return $collapsed ?: $normalized;
    }

    /**
     * Scan for prohibited adult domains, affiliate spam, and regex patterns
     */
    public function scanLinks(string $text): array
    {
        $detectedLinks = [];
        $lower = strtolower($text);

        // Adult TLD / domain regex pattern
        if (preg_match_all('/\b([a-z0-9-]+\.)+(xxx|adult|porn|sex|cam|tv)\b/i', $text, $matches)) {
            $detectedLinks = array_merge($detectedLinks, $matches[0]);
        }

        // Exact domain dictionary scanner
        foreach ($this->allPornSites as $domain) {
            if (stripos($lower, $domain) !== false) {
                $detectedLinks[] = $domain;
            }
        }

        return array_unique($detectedLinks);
    }

    /**
     * Check if text contains profanity or adult links, mask offending words, and generate moderation state.
     */
    public function filter(string $text): array
    {
        if (empty(trim($text))) {
            return [
                'has_profanity' => false,
                'has_adult_links' => false,
                'flagged_terms' => [],
                'cleaned_text' => $text,
                'is_approved' => true,
                'moderation_flag' => 'clean',
            ];
        }

        $detectedProfanities = [];
        $detectedLinks = $this->scanLinks($text);
        $normalized = $this->normalize($text);
        $cleanedText = $text;

        // Sort terms by length descending to match longer phrases first (e.g. "son of a bitch" before "bitch")
        $sortedTerms = $this->allProfanities;
        usort($sortedTerms, function ($a, $b) {
            return strlen($b) <=> strlen($a);
        });

        foreach ($sortedTerms as $term) {
            $fuzzyPattern = $this->buildFuzzyPattern($term);
            $termLower = strtolower($term);
            $simplePattern = '/\b' . preg_quote($termLower, '/') . '\b/iu';

            $matched = false;

            if (preg_match($fuzzyPattern, $cleanedText)) {
                $matched = true;
                $cleanedText = preg_replace($fuzzyPattern, '***', $cleanedText);
            } elseif (preg_match($simplePattern, $normalized) || preg_match($simplePattern, strtolower($text))) {
                $matched = true;
                $cleanedText = preg_replace($simplePattern, '***', $cleanedText);
            }

            if ($matched) {
                $detectedProfanities[] = $term;
            }
        }

        // Also mask detected adult links if present
        foreach ($detectedLinks as $link) {
            $cleanedText = str_ireplace($link, '[PROHIBITED LINK]', $cleanedText);
        }

        $hasProfanity = count($detectedProfanities) > 0;
        $hasAdultLinks = count($detectedLinks) > 0;
        $isApproved = !$hasProfanity && !$hasAdultLinks;

        $flag = 'clean';
        if ($hasAdultLinks) {
            $flag = 'adult_link_detected';
        } elseif ($hasProfanity) {
            $flag = 'profanity_detected';
        }

        return [
            'has_profanity' => $hasProfanity,
            'has_adult_links' => $hasAdultLinks,
            'flagged_terms' => array_unique(array_merge($detectedProfanities, $detectedLinks)),
            'cleaned_text' => $cleanedText,
            'is_approved' => $isApproved,
            'moderation_flag' => $flag,
        ];
    }
}
