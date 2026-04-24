import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useVerifyOTP } from '@/hooks/useAuthApi';
import { verifyOTPSchema, VerifyOTPFormData } from '@/schemas/auth';
import { useAuth } from '@/contexts/AuthContext';
import { setAuthToken } from '@/lib/auth';
import { useEffect } from 'react';
import { AxiosError } from 'axios';

const VerifyOTP: React.FC = () => {
    const { t } = useLanguage();
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const verifyMutation = useVerifyOTP();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VerifyOTPFormData>({
        resolver: zodResolver(verifyOTPSchema),
        defaultValues: { email },
    });

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    const onSubmit = async (data: VerifyOTPFormData) => {
        if (!data.email || !data.otp) return;
      
        try {
          const result = await verifyMutation.mutateAsync({
            email: data.email,
            otp: data.otp,
          });
      
          if (result.token) {
            setAuthToken(result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            setUser(result.user);
      
            toast.success(t('auth.verify.successTitle'), {
              description: t('auth.verify.successDescription'),
            });
      
            navigate('/dashboard', { replace: true });
          } else {
            toast.success(t('auth.verify.successTitle'), {
              description: t('auth.verify.successDescription'),
            });
      
            navigate('/login');
          }
        } catch (error: unknown) {
          // Narrow the error type
          let message = t('auth.verify.errorDescription');
          if (error instanceof AxiosError) {
            const data = error.response?.data as { message?: string } | undefined;
            message = data?.message || message;
          }
          toast.error(t('auth.verify.errorTitle'), { description: message });
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
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </motion.div>
                        <div>
                            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                                {t('auth.verify.title')}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                {t('auth.verify.subtitle')} {email}
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <input type="hidden" {...register('email')} />

                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-sm font-medium">
                                    {t('auth.verify.otpLabel')}
                                </Label>
                                <Input
                                    {...register('otp')}
                                    id="otp"
                                    type="text"
                                    placeholder="123456"
                                    maxLength={6}
                                    className="h-12 text-center text-2xl tracking-widest"
                                    disabled={verifyMutation.isPending}
                                />
                                {errors.otp && (
                                    <p className="text-destructive text-sm">{t(errors.otp.message || '')}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                                disabled={verifyMutation.isPending}
                            >
                                {verifyMutation.isPending ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                ) : (
                                    t('auth.verify.submit')
                                )}
                            </Button>
                        </form>

                        <div className="text-center">
                            <Link to="/register" className="text-sm text-primary hover:underline font-medium">
                                {t('auth.verify.backToRegister')}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default VerifyOTP;