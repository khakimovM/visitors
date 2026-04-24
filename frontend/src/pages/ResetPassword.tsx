import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useResetPassword } from '@/hooks/useAuthApi';
import { resetPasswordSchema, ResetPasswordFormData } from '@/schemas/auth';

const ResetPassword: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const resetPasswordMutation = useResetPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { email },
    });

    React.useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            await resetPasswordMutation.mutateAsync({
                email: data.email,
                otp: data.otp,
                newPassword: data.newPassword,
            });

            toast({
                title: t('auth.reset.successTitle'),
                description: t('auth.reset.successDescription'),
            });

            navigate('/login');
        } catch (error) {
            toast({
                title: t('auth.reset.errorTitle'),
                description: t('auth.reset.errorDescription'),
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4 md:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-warm border-0">
                    <CardHeader className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow"
                        >
                            <KeyRound className="w-8 h-8 text-white" />
                        </motion.div>
                        <div>
                            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                                {t('auth.reset.title')}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                {t('auth.reset.subtitle')}
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <input type="hidden" {...register('email')} />

                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-sm font-medium">
                                    {t('auth.reset.otpLabel')}
                                </Label>
                                <Input
                                    {...register('otp')}
                                    id="otp"
                                    type="text"
                                    placeholder="123456"
                                    maxLength={6}
                                    className="h-12 text-center text-2xl tracking-widest"
                                    disabled={resetPasswordMutation.isPending}
                                />
                                {errors.otp && (
                                    <p className="text-destructive text-sm">{t(errors.otp.message || '')}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-sm font-medium">
                                    {t('auth.reset.newPassword')}
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register('newPassword')}
                                        id="newPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 h-12"
                                        disabled={resetPasswordMutation.isPending}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="text-destructive text-sm">{t(errors.newPassword.message || '')}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                    {t('auth.reset.confirmPassword')}
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register('confirmPassword')}
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 h-12"
                                        disabled={resetPasswordMutation.isPending}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-destructive text-sm">{t(errors.confirmPassword.message || '')}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                                disabled={resetPasswordMutation.isPending}
                            >
                                {resetPasswordMutation.isPending ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                ) : (
                                    t('auth.reset.submit')
                                )}
                            </Button>
                        </form>

                        <div className="text-center">
                            <Link to="/login" className="text-sm text-primary hover:underline font-medium">
                                {t('auth.reset.backToLogin')}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ResetPassword;