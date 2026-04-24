import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'uz' | 'ru';

interface Translations {
  [key: string]: {
    uz: string;
    ru: string;
  };
}

const translations: Translations = {
  // Common
  'app.title': { uz: 'Visitor Track', ru: 'Visitor Track' },
  'app.subtitle': { uz: 'Restaurant Analytics', ru: 'Аналитика ресторана' },
  'common.save': { uz: 'Saqlash', ru: 'Сохранить' },
  'common.cancel': { uz: 'Bekor qilish', ru: 'Отменить' },
  'common.edit': { uz: 'Tahrirlash', ru: 'Редактировать' },
  'common.delete': { uz: 'O\'chirish', ru: 'Удалить' },
  'common.add': { uz: 'Qo\'shish', ru: 'Добавить' },
  'common.search': { uz: 'Qidirish', ru: 'Поиск' },
  'common.filter': { uz: 'Filtr', ru: 'Фильтр' },
  'common.actions': { uz: 'Amallar', ru: 'Действия' },
  'common.loading': { uz: 'Yuklanmoqda...', ru: 'Загрузка...' },
  'common.noData': { uz: 'Ma\'lumot topilmadi', ru: 'Данные не найдены' },
  'common.close': { uz: 'Yopish', ru: 'Закрыть' },
  'common.confirm': { uz: 'Tasdiqlash', ru: 'Подтвердить' },

  // Navigation
  'nav.dashboard': { uz: 'Dashboard', ru: 'Панель управления' },
  'nav.devices': { uz: 'Qurilmalar', ru: 'Устройства' },
  'nav.branches': { uz: 'Filiallar', ru: 'Филиалы' },
  'nav.system': { uz: 'Qurilmalar', ru: 'Устройства' },
  'nav.profile': { uz: 'Profil', ru: 'Профиль' },
  'nav.logout': { uz: 'Chiqish', ru: 'Выйти' },
  'nav.mainMenu': { uz: 'Asosiy menyu', ru: 'Главное меню' },

  // Dashboard
  'dashboard.title': { uz: 'Dashboard', ru: 'Панель управления' },
  'dashboard.subtitle': { uz: 'Real-time tashrif buyuruvchilar statistikasi', ru: 'Статистика посетителей в реальном времени' },
  'dashboard.currentVisitors': { uz: 'Hozirgi tashrif buyuruvchilar', ru: 'Текущие посетители' },
  'dashboard.todayEntries': { uz: 'Bugungi kirganlar', ru: 'Сегодня вошло' },
  'dashboard.todayExits': { uz: 'Bugungi chiqqanlar', ru: 'Сегодня вышло' },
  'dashboard.avgWaitTime': { uz: 'O\'rtacha kutish vaqti', ru: 'Среднее время ожидания' },
  'dashboard.totalTraffic': { uz: 'Bugungi jami harakatlar', ru: 'Всего движений за сегодня' },
  'dashboard.weeklyStats': { uz: 'Haftalik statistika', ru: 'Недельная статистика' },
  'dashboard.entriesExits': { uz: 'Kirgan va chiqqan tashrif buyuruvchilar', ru: 'Посетители: вход и выход' },
  'dashboard.branchStats': { uz: 'Filiallar bo\'yicha kirish-chiqishlar', ru: 'Вход-выход по филиалам' },
  'dashboard.todayStatsDesc': { uz: 'Bugungi tashrif buyuruvchilar statistikasi', ru: 'Статистика посетителей сегодня' },
  'dashboard.realTime': { uz: 'Real-time', ru: 'В реальном времени' },
  'dashboard.allBranches': { uz: 'Barcha filiallar', ru: 'Все филиалы' },
  'dashboard.selectBranch': { uz: 'Filialni tanlang', ru: 'Выберите филиал' },
  'dashboard.entries': { uz: 'Kirganlar', ru: 'Входы' },
  'dashboard.exits': { uz: 'Chiqqanlar', ru: 'Выходы' },
  'dashboard.7days': { uz: '7 kun', ru: '7 дней' },
  'dashboard.30days': { uz: '30 kun', ru: '30 дней' },
  'dashboard.3months': { uz: '3 oy', ru: '3 месяца' },
  'dashboard.addDevice': { uz: 'Qurilma qo\'shish', ru: 'Добавить устройство' },
  'dashboard.addDeviceDesc': { uz: 'Yangi qurilma qo\'shish uchun qurilma ID raqamini kiriting', ru: 'Введите ID номер устройства для добавления нового устройства' },
  'dashboard.deviceId': { uz: 'Qurilma ID', ru: 'ID устройства' },
  'dashboard.deviceIdPlaceholder': { uz: 'Qurilma ID raqamini kiriting', ru: 'Введите ID устройства' },
  'dashboard.deviceAddedSuccess': { uz: 'Qurilma muvaffaqiyatli qo\'shildi', ru: 'Устройство успешно добавлено' },
  'dashboard.deviceAddedError': { uz: 'Qurilma qo\'shishda xatolik', ru: 'Ошибка при добавлении устройства' },
  'dashboard.hourlyStats': { uz: 'Soatlik statistika', ru: 'Часовая статистика' },
  'dashboard.hourlyStatsDesc': { uz: 'Bugun soat bo\'yicha kirish va chiqishlar', ru: 'Входы и выходы по часам за сегодня' },
  'dashboard.export': { uz: 'Eksport', ru: 'Экспорт' },
  'dashboard.exportSuccess': { uz: 'Muvaffaqiyatli eksport qilindi', ru: 'Успешно экспортировано' },
  'dashboard.exportSuccessDesc': { uz: 'Ma\'lumotlar muvaffaqiyatli yuklab olindi', ru: 'Данные успешно загружены' },
  'dashboard.exportError': { uz: 'Eksport qilishda xatolik', ru: 'Ошибка при экспорте' },
  'dashboard.errorLoadingData': { uz: 'Ma\'lumotlarni yuklashda xatolik', ru: 'Ошибка при загрузке данных' },
  'dashboard.minutes': { uz: 'daqiqa', ru: 'минут' },
  'dashboard.date': { uz: 'Sana', ru: 'Дата' },
  'dashboard.indicator': { uz: 'Ko\'rsatkich', ru: 'Показатель' },
  'dashboard.value': { uz: 'Qiymat', ru: 'Значение' },
  'dashboard.total': { uz: 'Jami', ru: 'Всего' },
  'dashboard.branch': { uz: 'Filial', ru: 'Филиал' },
  'dashboard.email': { uz: 'Email', ru: 'Email' },
  'dashboard.lastActivity': { uz: 'Oxirgi faollik', ru: 'Последняя активность' },
  'dashboard.hour': { uz: 'Soat', ru: 'Час' },
  'dashboard.dateRange': { uz: 'Sana oralig\'i', ru: 'Диапазон дат' },
  'dashboard.selectedBranch': { uz: 'Tanlangan filial', ru: 'Выбранный филиал' },
  'dashboard.last7Days': {
    uz: 'Oxirgi 7 kun',
    ru: 'Последние 7 дней',
  },
  'dashboard.last14Days': {
    uz: 'Oxirgi 14 kun',
    ru: 'Последние 14 дней',
  },
  'dashboard.last30Days': {
    uz: 'Oxirgi 30 kun',
    ru: 'Последние 30 дней',
  },
  'dashboard.todayHourlyStats': {
    uz: 'Bugungi soatlik statistika',
    ru: 'Почасовая статистика за сегодня',
  },
  'dashboard.todayHourlyStatsDesc': {
    uz: 'Har soatdagi kirish va chiqishlar',
    ru: 'Входы и выходы по каждому часу',
  },
  'dashboard.todayBranchStats': {
    uz: 'Bugungi filiallar statistikasi',
    ru: 'Статистика филиалов за сегодня',
  },
  'dashboard.branchStatsDesc': {
    uz: 'Filiallar bo‘yicha kirish va chiqishlar',
    ru: 'Входы и выходы по филиалам',
  },
  'common.exportData': {
    uz: 'Maʼlumotlarni eksport qilish',
    ru: 'Экспорт данных',
  },
  'dashboard.weeklyEntriesExits': {
    uz: 'Haftalik kirish va chiqishlar',
    ru: 'Недельные входы и выходы',
  },
  'dashboard.entriesExitsDesc': {
    uz: 'Hafta davomida kirgan va chiqqan tashrif buyuruvchilar',
    ru: 'Посетители, вошедшие и вышедшие за неделю',
  },
  'dashboard.chartTitle7': {
    uz: '7 kunlik kirish va chiqishlar',
    ru: 'Входы и выходы за 7 дней',
  },
  'dashboard.chartTitle14': {
    uz: '14 kunlik kirish va chiqishlar',
    ru: 'Входы и выходы за 14 дней',
  },
  'dashboard.chartTitle30': {
    uz: '1 oylik kirish va chiqishlar',
    ru: 'Входы и выходы за месяц',
  },
  'dashboard.chartDesc7': {
    uz: "So'nggi 7 kun davomida kirgan va chiqqan tashrif buyuruvchilar",
    ru: 'Посетители за последние 7 дней',
  },
  'dashboard.chartDesc14': {
    uz: "So'nggi 14 kun davomida kirgan va chiqqan tashrif buyuruvchilar",
    ru: 'Посетители за последние 14 дней',
  },
  'dashboard.chartDesc30': {
    uz: "So'nggi 1 oy davomida kirgan va chiqqan tashrif buyuruvchilar",
    ru: 'Посетители за последний месяц',
  },

  // Branches
  'branches.title': { uz: 'Filiallarni boshqarish', ru: 'Управление филиалами' },
  'branches.subtitle': { uz: 'Restoran filiallari va ularning ma\'lumotlari', ru: 'Филиалы ресторана и их данные' },
  'branches.addBranch': { uz: 'Filial qo\'shish', ru: 'Добавить филиал' },
  'branches.editBranch': { uz: 'Filialni tahrirlash', ru: 'Редактировать филиал' },
  'branches.totalBranches': { uz: 'Jami filiallar', ru: 'Всего филиалов' },
  'branches.activeBranches': { uz: 'Faol filiallar', ru: 'Активные филиалы' },
  'branches.todayVisitors': { uz: 'Bugungi tashrif buyuruvchilar', ru: 'Посетители сегодня' },
  'branches.name': { uz: 'Filial nomi', ru: 'Название филиала' },
  'branches.location': { uz: 'Joylashuv', ru: 'Местоположение' },
  'branches.manager': { uz: 'Menejer', ru: 'Менеджер' },
  'branches.status': { uz: 'Holat', ru: 'Статус' },
  'branches.visitors': { uz: 'Tashrif buyuruvchilar', ru: 'Посетители' },
  'branches.createdAt': { uz: 'Yaratilgan', ru: 'Создано' },
  'branches.active': { uz: 'Faol', ru: 'Активный' },
  'branches.inactive': { uz: 'Nofaol', ru: 'Неактивный' },
  'branches.maintenance': { uz: 'Texnik xizmat', ru: 'Обслуживание' },

  // Devices
  "devices.title": { uz: "Qurilmalarni boshqarish", ru: "Управление устройствами" },
  "devices.addDevice": { uz: "Qurilma qo'shish", ru: "Добавить устройство" },
  "devices.editDevice": { uz: "Qurilmani tahrirlash", ru: "Редактировать устройство" },
  "devices.id": { uz: "ID raqami", ru: "ID номер" },
  "devices.deviceId": { uz: "Qurilma ID", ru: "ID устройства" },
  "devices.user": {
    "uz": "Foydalanuvchi",
    "ru": "Пользователь"
  },
  "devices.userSelect": { uz: "Foydalanuvchini tanlang", ru: "Выберите пользователя" },
  "devices.selectUser": { uz: "Foydalanuvchi tanlash", ru: "Выбор пользователя" },
  "devices.actions": { uz: "Amallar", ru: "Действия" },
  "devices.loading": { uz: "Yuklanmoqda...", ru: "Загрузка..." },
  "devices.noData": { uz: "Hech qanday qurilma topilmadi", ru: "Устройства не найдены" },
  "devices.addSuccess": { uz: "Qurilma qo'shildi", ru: "Устройство добавлено" },
  "devices.editSuccess": { uz: "Qurilma yangilandi", ru: "Устройство обновлено" },
  "devices.deleteSuccess": { uz: "Qurilma o'chirildi", ru: "Устройство удалено" },
  "devices.error": { uz: "Xatolik yuz berdi", ru: "Произошла ошибка" },

  // Settings
  'settings.title': { uz: 'Sozlamalar', ru: 'Настройки' },
  'settings.subtitle': { uz: 'Tizim va qurilmalar sozlamalarini boshqarish', ru: 'Управление системными и устройственными настройками' },
  'settings.deviceManagement': { uz: 'Qurilmalarni boshqarish', ru: 'Управление устройствами' },
  'settings.networkSettings': { uz: 'Tarmoq sozlamalari', ru: 'Настройки сети' },
  'settings.deviceName': { uz: 'Qurilma nomi', ru: 'Название устройства' },
  'settings.deviceType': { uz: 'Qurilma turi', ru: 'Тип устройства' },
  'settings.ipAddress': { uz: 'IP manzil', ru: 'IP адрес' },
  'settings.wifiName': { uz: 'WiFi nomi', ru: 'Имя WiFi' },
  'settings.wifiPassword': { uz: 'WiFi parol', ru: 'Пароль WiFi' },
  'settings.serverUrl': { uz: 'Server URL', ru: 'URL сервера' },
  'settings.apiKey': { uz: 'API kalit', ru: 'API ключ' },
  'settings.syncInterval': { uz: 'Sinxronizatsiya intervali', ru: 'Интервал синхронизации' },
  'settings.deviceLocation': { uz: 'Qurilma joylashuvi', ru: 'Местоположение устройства' },
  'settings.branch': { uz: 'Filial', ru: 'Филиал' },
  'settings.sensitivity': { uz: 'Sezuvchanlik', ru: 'Чувствительность' },
  'settings.status': { uz: 'Holat', ru: 'Статус' },
  'settings.lastUpdate': { uz: 'Oxirgi yangilanish', ru: 'Последнее обновление' },
  'settings.deviceConfig': { uz: 'Qurilma konfiguratsiyasi', ru: 'Конфигурация устройства' },
  'settings.networkConfig': { uz: 'Tarmoq konfiguratsiyasi', ru: 'Конфигурация сети' },
  'settings.autoSync': { uz: 'Avtomatik sinxronizatsiya', ru: 'Автоматическая синхронизация' },
  'settings.dataRetention': { uz: 'Ma\'lumotlarni saqlash muddati', ru: 'Срок хранения данных' },
  'settings.totalDevices': { uz: 'Jami qurilmalar', ru: 'Всего устройств' },
  'settings.activeDevices': { uz: 'Faol qurilmalar', ru: 'Активные устройства' },
  'settings.inactiveDevices': { uz: 'Nofaol qurilmalar', ru: 'Неактивные устройства' },
  'settings.sync': { uz: 'Sinxronizatsiya', ru: 'Синхронизация' },
  'settings.addDevice': { uz: 'Yangi qurilma', ru: 'Новое устройство' },
  'settings.syncNow': { uz: 'Sinxronlash', ru: 'Синхронизировать' },
  'settings.devicesList': { uz: 'Qurilmalar ro\'yxati', ru: 'Список устройств' },
  'settings.allDevices': { uz: 'Barcha tashrif buyuruvchilarni hisoblovchi qurilmalar', ru: 'Все устройства подсчета посетителей' },
  'settings.branchSettings': { uz: 'Filial sozlamalari', ru: 'Настройки филиалов' },
  'settings.branchesConfig': { uz: 'Filiallar konfiguratsiyasi', ru: 'Конфигурация филиалов' },
  'settings.addBranch': { uz: 'Filial qo\'shish', ru: 'Добавить филиал' },
  'settings.editBranch': { uz: 'Filialni tahrirlash', ru: 'Редактировать филиал' },
  'settings.branchName': { uz: 'Filial nomi', ru: 'Название филиала' },
  'settings.branchAddress': { uz: 'Filial manzili', ru: 'Адрес филиала' },
  'settings.branchPhone': { uz: 'Telefon raqami', ru: 'Номер телефона' },
  'settings.workingHours': { uz: 'Ish vaqti', ru: 'Рабочие часы' },
  'settings.branchCapacity': { uz: 'O\'rindiqlar soni', ru: 'Количество мест' },
  'settings.deviceId': { uz: 'Qurilma ID', ru: 'ID устройства' },
  'settings.deviceModel': { uz: 'Qurilma modeli', ru: 'Модель устройства' },
  'settings.connectionStatus': { uz: 'Ulanish holati', ru: 'Статус подключения' },
  'settings.firmware': { uz: 'Firmware versiyasi', ru: 'Версия прошивки' },
  'settings.calibration': { uz: 'Kalibrlash', ru: 'Калибровка' },
  'settings.dataCollection': { uz: 'Ma\'lumot yig\'ish', ru: 'Сбор данных' },
  'settings.privacyMode': { uz: 'Maxfiylik rejimi', ru: 'Режим конфиденциальности' },
  'settings.notificationSettings': { uz: 'Bildirishnoma sozlamalari', ru: 'Настройки уведомлений' },
  'settings.alertThreshold': { uz: 'Ogohlantirish chegarasi', ru: 'Порог предупреждения' },
  'settings.dailyReports': { uz: 'Kunlik hisobotlar', ru: 'Ежедневные отчеты' },
  'settings.weeklyReports': { uz: 'Haftalik hisobotlar', ru: 'Еженедельные отчеты' },
  'settings.monthlyReports': { uz: 'Oylik hisobotlar', ru: 'Ежемесячные отчеты' },

  // Header
  'header.fullscreen': { uz: 'To\'liq ekran', ru: 'Полный экран' },
  'header.exitFullscreen': { uz: 'Chiqish', ru: 'Выйти' },

  // Profile
  'profile.title': { uz: 'Foydalanuvchi profili', ru: 'Профиль пользователя' },
  'profile.subtitle': { uz: 'Shaxsiy ma\'lumotlar va hisob sozlamalari', ru: 'Личная информация и настройки аккаунта' },
  'profile.personalInfo': { uz: 'Shaxsiy ma\'lumotlar', ru: 'Личная информация' },
  'profile.firstName': { uz: 'Ism', ru: 'Имя' },
  'profile.lastName': { uz: 'Familiya', ru: 'Фамилия' },
  'profile.email': { uz: 'Email', ru: 'Email' },
  'profile.phone': { uz: 'Telefon', ru: 'Телефон' },
  'profile.position': { uz: 'Lavozim', ru: 'Должность' },
  'profile.department': { uz: 'Bo\'lim', ru: 'Отдел' },
  'profile.changePassword': { uz: 'Parolni o\'zgartirish', ru: 'Изменить пароль' },
  'profile.currentPassword': { uz: 'Joriy parol', ru: 'Текущий пароль' },
  'profile.newPassword': { uz: 'Yangi parol', ru: 'Новый пароль' },
  'profile.confirmPassword': { uz: 'Parolni tasdiqlash', ru: 'Подтвердить пароль' },
  'profile.username': { uz: 'Username', ru: 'Имя пользователя' },
  'profile.information': { uz: 'Profil ma\'lumotlari', ru: 'Информация профиля' },
  'profile.informationDesc': { uz: 'Username va email manzilingizni yangilang', ru: 'Обновите имя пользователя и email адрес' },
  'profile.changePasswordDesc': { uz: 'Hisobingiz xavfsizligi uchun parolni yangilang', ru: 'Обновите пароль для безопасности вашей учетной записи' },
  'profile.accountInfo': { uz: 'Hisob ma\'lumotlari', ru: 'Информация об аккаунте' },
  'profile.userId': { uz: 'Foydalanuvchi ID', ru: 'ID пользователя' },
  'profile.registeredDate': { uz: 'Ro\'yxatdan o\'tgan sana', ru: 'Дата регистрации' },
  'profile.lastActivity': { uz: 'Oxirgi faollik', ru: 'Последняя активность' },
  'profile.status': { uz: 'Status', ru: 'Статус' },
  'profile.active': { uz: 'Faol', ru: 'Активный' },
  'profile.updating': { uz: 'Yangilanmoqda...', ru: 'Обновляется...' },
  'profile.updatePassword': { uz: 'Parolni yangilash', ru: 'Обновить пароль' },
  'profile.profileUpdated': { uz: 'Profil yangilandi', ru: 'Профиль обновлен' },
  'profile.profileUpdatedDesc': { uz: 'Profil ma\'lumotlaringiz muvaffaqiyatli yangilandi', ru: 'Информация вашего профиля успешно обновлена' },
  'profile.passwordUpdated': { uz: 'Parol yangilandi', ru: 'Пароль обновлен' },
  'profile.passwordUpdatedDesc': { uz: 'Parolingiz muvaffaqiyatli yangilandi', ru: 'Ваш пароль успешно обновлен' },
  'profile.profileUpdateError': { uz: 'Profilni yangilashda xatolik', ru: 'Ошибка при обновлении профиля' },

  // Login
  'login.title': { uz: 'Visitor Track', ru: 'Visitor Track' },
  'login.subtitle': { uz: 'Restaurant Analytics Dashboard', ru: 'Панель аналитики ресторана' },
  'login.username': { uz: 'Foydalanuvchi nomi', ru: 'Имя пользователя' },
  'login.email': { uz: 'Email manzil', ru: 'Email адрес' },
  'login.password': { uz: 'Parol', ru: 'Пароль' },
  'login.submit': { uz: 'Kirish', ru: 'Войти' },
  'login.forgotPassword': { uz: 'Parolni unutdingizmi?', ru: 'Забыли пароль?' },
  'login.createAccount': { uz: 'Ro\'yxatdan o\'tish', ru: 'Зарегистрироваться' },
  'login.successTitle': { uz: 'Muvaffaqiyatli kirish', ru: 'Успешный вход' },
  'login.successDescription': { uz: 'Tizimga muvaffaqiyatli kirdingiz!', ru: 'Вы успешно вошли в систему!' },
  'login.errorTitle': { uz: 'Xato', ru: 'Ошибка' },
  'login.errorDescription': { uz: 'Foydalanuvchi nomi yoki parol noto\'g\'ri!', ru: 'Неверное имя пользователя или пароль!' },

  // Auth Register
  'auth.register.title': { uz: 'Ro\'yxatdan o\'tish', ru: 'Регистрация' },
  'auth.register.subtitle': { uz: 'Yangi hisob yarating', ru: 'Создать новый аккаунт' },
  'auth.register.email': { uz: 'Email manzil', ru: 'Email адрес' },
  'auth.register.username': { uz: 'Foydalanuvchi nomi', ru: 'Имя пользователя' },
  'auth.register.password': { uz: 'Parol', ru: 'Пароль' },
  'auth.register.submit': { uz: 'Ro\'yxatdan o\'tish', ru: 'Зарегистрироваться' },
  'auth.register.haveAccount': { uz: 'Hisobingiz bormi?', ru: 'Уже есть аккаунт?' },
  'auth.register.loginLink': { uz: 'Kirish', ru: 'Войти' },
  'auth.register.successTitle': { uz: 'Muvaffaqiyatli', ru: 'Успешно' },
  'auth.register.successDescription': { uz: 'Tasdiqlash kodini emailingizni tekshiring', ru: 'Проверьте свою почту для кода подтверждения' },
  'auth.register.errorTitle': { uz: 'Xato', ru: 'Ошибка' },
  'auth.register.errorDescription': { uz: 'Ro\'yxatdan o\'tishda xatolik yuz berdi', ru: 'Ошибка при регистрации' },

  // Auth Verify
  'auth.verify.title': { uz: 'Emailni tasdiqlash', ru: 'Подтверждение Email' },
  'auth.verify.subtitle': { uz: 'Tasdiqlash kodini kiriting', ru: 'Введите код подтверждения' },
  'auth.verify.otpLabel': { uz: 'Tasdiqlash kodi', ru: 'Код подтверждения' },
  'auth.verify.submit': { uz: 'Tasdiqlash', ru: 'Подтвердить' },
  'auth.verify.backToRegister': { uz: 'Ro\'yxatdan o\'tishga qaytish', ru: 'Вернуться к регистрации' },
  'auth.verify.successTitle': { uz: 'Muvaffaqiyatli', ru: 'Успешно' },
  'auth.verify.successDescription': { uz: 'Email tasdiqlandi!', ru: 'Email подтвержден!' },
  'auth.verify.errorTitle': { uz: 'Xato', ru: 'Ошибка' },
  'auth.verify.errorDescription': { uz: 'Tasdiqlash kodida xatolik', ru: 'Неверный код подтверждения' },

  // Auth Forgot Password
  'auth.forgot.title': { uz: 'Parolni tiklash', ru: 'Восстановление пароля' },
  'auth.forgot.subtitle': { uz: 'Email manzilingizni kiriting', ru: 'Введите ваш email адрес' },
  'auth.forgot.email': { uz: 'Email manzil', ru: 'Email адрес' },
  'auth.forgot.submit': { uz: 'Kodni yuborish', ru: 'Отправить код' },
  'auth.forgot.backToLogin': { uz: 'Kirishga qaytish', ru: 'Вернуться ко входу' },
  'auth.forgot.successTitle': { uz: 'Muvaffaqiyatli', ru: 'Успешно' },
  'auth.forgot.successDescription': { uz: 'Tasdiqlash kodi emailingizga yuborildi', ru: 'Код подтверждения отправлен на вашу почту' },
  'auth.forgot.errorTitle': { uz: 'Xato', ru: 'Ошибка' },
  'auth.forgot.errorDescription': { uz: 'Email yuborishda xatolik', ru: 'Ошибка при отправке email' },

  // Auth Reset Password
  'auth.reset.title': { uz: 'Parolni yangilash', ru: 'Сброс пароля' },
  'auth.reset.subtitle': { uz: 'Yangi parol kiriting', ru: 'Введите новый пароль' },
  'auth.reset.otpLabel': { uz: 'Tasdiqlash kodi', ru: 'Код подтверждения' },
  'auth.reset.newPassword': { uz: 'Yangi parol', ru: 'Новый пароль' },
  'auth.reset.confirmPassword': { uz: 'Parolni tasdiqlang', ru: 'Подтвердите пароль' },
  'auth.reset.submit': { uz: 'Parolni yangilash', ru: 'Сбросить пароль' },
  'auth.reset.backToLogin': { uz: 'Kirishga qaytish', ru: 'Вернуться ко входу' },
  'auth.reset.successTitle': { uz: 'Muvaffaqiyatli', ru: 'Успешно' },
  'auth.reset.successDescription': { uz: 'Parol muvaffaqiyatli yangilandi!', ru: 'Пароль успешно изменен!' },
  'auth.reset.errorTitle': { uz: 'Xato', ru: 'Ошибка' },
  'auth.reset.errorDescription': { uz: 'Parolni yangilashda xatolik', ru: 'Ошибка при сбросе пароля' },

  // Auth Validation
  'auth.validation.invalidEmail': { uz: 'Email manzil noto\'g\'ri formatda', ru: 'Неверный формат email' },
  'auth.validation.usernameMin': { uz: 'Foydalanuvchi nomi kamida 3 ta belgidan iborat bo\'lishi kerak', ru: 'Имя пользователя должно содержать минимум 3 символа' },
  'auth.validation.usernameMax': { uz: 'Foydalanuvchi nomi 50 ta belgidan oshmasligi kerak', ru: 'Имя пользователя не должно превышать 50 символов' },
  'auth.validation.passwordMin': { uz: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak', ru: 'Пароль должен содержать минимум 6 символов' },
  'auth.validation.usernameRequired': { uz: 'Foydalanuvchi nomi majburiy', ru: 'Имя пользователя обязательно' },
  'auth.validation.passwordRequired': { uz: 'Parol majburiy', ru: 'Пароль обязателен' },
  'auth.validation.otpLength': { uz: 'Tasdiqlash kodi 6 ta raqamdan iborat bo\'lishi kerak', ru: 'Код подтверждения должен содержать 6 цифр' },
  'auth.validation.passwordMatch': { uz: 'Parollar mos kelmaydi', ru: 'Пароли не совпадают' },

  // Toast messages
  'toast.saved': { uz: 'Muvaffaqiyatli saqlandi', ru: 'Успешно сохранено' },
  'toast.deleted': { uz: 'Muvaffaqiyatli o\'chirildi', ru: 'Успешно удалено' },
  'toast.error': { uz: 'Xatolik yuz berdi', ru: 'Произошла ошибка' },
  'toast.updated': { uz: 'Yangilandi', ru: 'Обновлено' },
  'toast.exportStarted': { uz: 'Eksport boshlandi', ru: 'Экспорт начат' },
  'toast.exportDesc': { uz: 'Hisobot yuklab olinmoqda...', ru: 'Отчет загружается...' },
};

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("uz")

  // 🔹 Refresh bo‘lganda localStorage’dan o‘qish
  useEffect(() => {
    const storedLang = localStorage.getItem("language") as Language | null
    if (storedLang) {
      setLanguageState(storedLang)
    }
  }, [])

  // 🔹 Tilni almashtirish
  const setLanguage = (lang: Language) => {
    localStorage.setItem("language", lang)
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
