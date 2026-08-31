import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Staff & Management Login" />

            <div className="mb-6 text-center">
                <h1 className="font-serif text-2xl font-bold text-[#f0e0d1] tracking-wide">
                    Staff & Management Portal
                </h1>
                <p className="text-xs text-[#a89f91] mt-1">
                    Sign in to access POS Cashier, Kitchen KDS, or Admin Console
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800 p-3 rounded-lg">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Staff Email Address" className="text-[#d5c7b7] font-semibold text-xs uppercase tracking-wider mb-1" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-[#26221d] border-[#4a3e30] text-[#f0e0d1] placeholder-[#736859] focus:border-[#f59e0b] focus:ring-[#f59e0b] rounded-lg px-3.5 py-2.5"
                        placeholder="staff@saddleranch.ph"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-1.5 text-rose-400 text-xs" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="text-[#d5c7b7] font-semibold text-xs uppercase tracking-wider mb-1" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-[#26221d] border-[#4a3e30] text-[#f0e0d1] placeholder-[#736859] focus:border-[#f59e0b] focus:ring-[#f59e0b] rounded-lg px-3.5 py-2.5"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-1.5 text-rose-400 text-xs" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center cursor-pointer select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded border-[#4a3e30] bg-[#26221d] text-[#f59e0b] focus:ring-[#f59e0b] focus:ring-offset-[#1c1a17]"
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                        />
                        <span className="ms-2 text-xs text-[#a89f91] hover:text-[#d5c7b7]">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs text-[#f59e0b] hover:text-amber-300 transition-colors underline font-medium"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full justify-center bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold uppercase tracking-widest py-3 text-sm rounded-lg shadow-lg shadow-amber-950/40 transition-all active:scale-[0.99]" disabled={processing}>
                        {processing ? 'Signing in...' : 'Sign In to Portal'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
