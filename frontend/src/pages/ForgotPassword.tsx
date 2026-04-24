import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, KeyRound } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useForgotPassword } from '@/hooks/useAuthApi';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/schemas/auth';
import { AxiosError } from 'axios';

const ForgotPassword: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const forgotPasswordMutation = useForgotPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        if (!data.email) return;

        try {
            await forgotPasswordMutation.mutateAsync({ email: data.email });

            toast.success(t('auth.forgot.successTitle'), {
                description: t('auth.forgot.successDescription'),
            });

            navigate('/reset-password', { state: { email: data.email } });
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(t('auth.forgot.errorTitle'), {
                description: axiosError.response?.data?.message || t('auth.forgot.errorDescription'),
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
                                {t('auth.forgot.title')}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                {t('auth.forgot.subtitle')}
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    {t('auth.forgot.email')}
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        {...register('email')}
                                        id="email"
                                        type="email"
                                        placeholder="user@example.com"
                                        className="pl-10 h-12"
                                        disabled={forgotPasswordMutation.isPending}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-destructive text-sm">{t(errors.email.message || '')}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                                disabled={forgotPasswordMutation.isPending}
                            >
                                {forgotPasswordMutation.isPending ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                ) : (
                                    t('auth.forgot.submit')
                                )}
                            </Button>
                        </form>

                        <div className="text-center">
                            <Link to="/login" className="text-sm text-primary hover:underline font-medium">
                                {t('auth.forgot.backToLogin')}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;