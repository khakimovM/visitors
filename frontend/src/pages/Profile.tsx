import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUpdateUser } from '@/hooks/useAuthApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const profileSchema = z.object({
  username: z.string().min(3, 'Username kamida 3 ta belgidan iborat bo\'lishi kerak'),
  email: z.string().email('Email manzil noto\'g\'ri'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Joriy parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
  newPassword: z.string().min(6, 'Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
  confirmPassword: z.string().min(6, 'Parolni tasdiqlash kamida 6 ta belgidan iborat bo\'lishi kerak'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Parollar mos kelmaydi",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const Profile = () => {
  const { t } = useLanguage();
  const { user, setUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const updateUserMutation = useUpdateUser();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true);

    updateUserMutation.mutate(data, {
      onSuccess: () => {
        // Update user in context and localStorage
        const updatedUser = {
          ...user,
          username: data.username,
          email: data.email,
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success(t('profile.profileUpdated'), {
          description: t('profile.profileUpdatedDesc'),
        });
        setIsUpdating(false);
      },
      onError: () => {
        toast.error(t('error'), {
          description: t('profile.profileUpdateError'),
        });
        setIsUpdating(false);
      },
    });
  };

  // const onPasswordSubmit = async (data: PasswordFormData) => {
  //   setIsUpdating(true);

  //   // Simulate API call for password update
  //   await new Promise(resolve => setTimeout(resolve, 1000));

  //   toast.success(t('profile.passwordUpdated'), {
  //     description: t('profile.passwordUpdatedDesc'),
  //   });

  //   passwordForm.reset();
  //   setIsUpdating(false);
  // };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('profile.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('profile.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {/* Profile Information */}
          <Card className="border-border bg-card shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                {t('profile.information')}
              </CardTitle>
              <CardDescription>
                {t('profile.informationDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{t('profile.username')}</Label>
                  <Input
                    id="username"
                    {...profileForm.register('username')}
                    className="bg-background border-input focus:ring-2 focus:ring-primary"
                  />
                  {profileForm.formState.errors.username && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('profile.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register('email')}
                    className="bg-background border-input focus:ring-2 focus:ring-primary"
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isUpdating ? t('profile.updating') : t('common.save')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          {/* <Card className="border-border bg-card shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <div className="w-10 h-10 bg-gradient-to-br from-warning to-warning/80 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                {t('profile.changePassword')}
              </CardTitle>
              <CardDescription>
                {t('profile.changePasswordDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register('currentPassword')}
                    className="bg-background border-input focus:ring-2 focus:ring-warning"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register('newPassword')}
                    className="bg-background border-input focus:ring-2 focus:ring-warning"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('profile.confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                    className="bg-background border-input focus:ring-2 focus:ring-warning"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-gradient-to-r from-warning to-warning/80 text-white hover:from-warning/90 hover:to-warning/70 shadow-lg"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {isUpdating ? t('profile.updating') : t('profile.updatePassword')}
                </Button>
              </form>
            </CardContent>
          </Card> */}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;