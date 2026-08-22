<?php

namespace Database\Seeders;

use App\Models\Rating;
use Illuminate\Database\Seeder;

class RatingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reviews = [
            [
                'customer_name' => 'Karlo Mendoza',
                'branch' => 'Bulihan',
                'overall_rating' => 5,
                'food_quality_rating' => 5,
                'customer_service_rating' => 5,
                'delivery_speed_rating' => 5,
                'packaging_rating' => 5,
                'comment' => 'The Sizzling Pork Sisig with egg is hands down the best in Silang! Delivered piping hot and the crunchiness stays perfect.',
                'favorite_dish' => 'Sizzling Pork Sisig (w/ Egg)',
                'is_featured' => true,
            ],
            [
                'customer_name' => 'Patricia Santos',
                'branch' => 'Dasmarinas',
                'overall_rating' => 5,
                'food_quality_rating' => 5,
                'customer_service_rating' => 5,
                'delivery_speed_rating' => 5,
                'packaging_rating' => 5,
                'comment' => 'Super fast table QR ordering here at Governor\'s Drive. Staff brought the sizzling platters in less than 10 minutes with overflowing chicken oil!',
                'favorite_dish' => 'Sizzling Chicken Inasal',
                'is_featured' => true,
            ],
            [
                'customer_name' => 'Dave Villanueva',
                'branch' => 'Bulihan',
                'overall_rating' => 5,
                'food_quality_rating' => 5,
                'customer_service_rating' => 5,
                'delivery_speed_rating' => 4,
                'packaging_rating' => 5,
                'comment' => 'Barkada platter is huge and super sulit for our family Sunday dinner. The authentic savory garlic rice pairing is legendary.',
                'favorite_dish' => 'Barkada Sisig Bilao Platter',
                'is_featured' => true,
            ],
            [
                'customer_name' => 'Michelle Alcantara',
                'branch' => 'Dasmarinas',
                'overall_rating' => 5,
                'food_quality_rating' => 5,
                'customer_service_rating' => 5,
                'delivery_speed_rating' => 5,
                'packaging_rating' => 5,
                'comment' => 'The Pork Sinigang has that authentic sour tamarind kick with tender melt-in-your-mouth pork. Best comfort food after work!',
                'favorite_dish' => 'Pork Sinigang',
                'is_featured' => true,
            ],
            [
                'customer_name' => 'Christian Reyes',
                'branch' => 'Bulihan',
                'overall_rating' => 5,
                'food_quality_rating' => 5,
                'customer_service_rating' => 4,
                'delivery_speed_rating' => 5,
                'packaging_rating' => 5,
                'comment' => 'Online delivery was seamless! Free delivery in Bulihan area and arrived wrapped neatly with zero oil spills.',
                'favorite_dish' => 'Sizzling Spicy Beef',
                'is_featured' => true,
            ],
            [
                'customer_name' => 'Jasmine Dela Cruz',
                'branch' => 'Dasmarinas',
                'overall_rating' => 5,
                'food_quality_rating' => 5,
                'customer_service_rating' => 5,
                'delivery_speed_rating' => 5,
                'packaging_rating' => 5,
                'comment' => 'Cowboy roadhouse ambience is so rustic and cozy. Love the sizzling burger steak with generous mushroom gravy.',
                'favorite_dish' => 'Sizzling Burger Steak',
                'is_featured' => true,
            ],
        ];

        foreach ($reviews as $review) {
            Rating::firstOrCreate(
                [
                    'customer_name' => $review['customer_name'],
                    'branch' => $review['branch'],
                ],
                $review
            );
        }
    }
}
