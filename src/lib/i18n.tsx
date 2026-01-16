'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'id' | 'en' | 'zh' | 'ru';

interface Translations {
    [key: string]: {
        id: string;
        en: string;
        zh: string;
        ru: string;
    };
}

export const translations: Translations = {
    // ===== COMMON =====
    'common.loading': { id: 'Memuat...', en: 'Loading...', zh: '加载中...', ru: 'Загрузка...' },
    'common.copy': { id: 'Salin', en: 'Copy', zh: '复制', ru: 'Копировать' },
    'common.close': { id: 'Tutup', en: 'Close', zh: '关闭', ru: 'Закрыть' },
    'common.submit': { id: 'Kirim', en: 'Submit', zh: '提交', ru: 'Отправить' },
    'common.generate': { id: 'Generate', en: 'Generate', zh: '生成', ru: 'Генерировать' },
    'common.cost': { id: 'Biaya', en: 'Cost', zh: '费用', ru: 'Стоимость' },
    'common.free': { id: 'Gratis', en: 'Free', zh: '免费', ru: 'Бесплатно' },
    'common.logout': { id: 'Keluar', en: 'Logout', zh: '登出', ru: 'Выход' },
    'common.login': { id: 'Masuk', en: 'Login', zh: '登录', ru: 'Войти' },

    // ===== LANDING PAGE =====
    'landing.nav.vision': { id: 'Visi 5.0', en: 'Vision 5.0', zh: '愿景 5.0', ru: 'Видение 5.0' },
    'landing.nav.toolkit': { id: 'Toolkit', en: 'Toolkit', zh: '工具包', ru: 'Инструменты' },
    'landing.nav.agility': { id: 'Agility', en: 'Agility', zh: '敏捷性', ru: 'Гибкость' },
    'landing.nav.login': { id: 'Masuk Ke App', en: 'Enter App', zh: '进入应用', ru: 'Войти' },

    'landing.hero.badge': { id: 'Marketing 5.0 untuk Super Affiliates', en: 'Marketing 5.0 for Super Affiliates', zh: '超级联盟的营销5.0', ru: 'Маркетинг 5.0 для суперпартнёров' },
    'landing.hero.title1': { id: 'Dominasi', en: 'Dominate', zh: '主导', ru: 'Доминируй' },
    'landing.hero.title2': { id: 'Market', en: 'Market', zh: '市场', ru: 'на рынке' },
    'landing.hero.title3': { id: 'Tanpa', en: 'Without', zh: '无需', ru: 'Без' },
    'landing.hero.title4': { id: 'Banting Tulang.', en: 'Breaking Your Back.', zh: '费力工作。', ru: 'изнурительной работы.' },
    'landing.hero.title5': { id: 'Ditenagai Otak AI.', en: 'Powered by AI Brain.', zh: '由AI驱动。', ru: 'На силе ИИ.' },
    'landing.hero.desc': { id: 'Era affiliate manual sudah berakhir. Affimate Super Apps hadir membekali lo dengan', en: 'The era of manual affiliate is over. Affimate Super Apps equips you with', zh: '手动联盟时代已经结束。Affimate Super Apps为您提供', ru: 'Эра ручного партнёрства закончилась. Affimate Super Apps предоставляет вам' },
    'landing.hero.augmented': { id: 'Augmented Creativity', en: 'Augmented Creativity', zh: '增强创意', ru: 'Расширенное творчество' },
    'landing.hero.desc2': { id: '— dari riset hingga produksi konten viral, biarkan AI kami yang mengeksekusi dengan kecepatan 5x lipat.', en: '— from research to viral content production, let our AI execute at 5x speed.', zh: '——从研究到病毒式内容制作，让我们的AI以5倍速度执行。', ru: '— от исследования до создания вирусного контента, позвольте нашему ИИ работать в 5 раз быстрее.' },
    'landing.hero.cta': { id: 'Mulai Sekarang', en: 'Start Now', zh: '立即开始', ru: 'Начать сейчас' },
    'landing.hero.efficiency': { id: 'Efficiency', en: 'Efficiency', zh: '效率', ru: 'Эффективность' },
    'landing.hero.inc': { id: 'Inc.', en: 'Inc.', zh: '提升', ru: 'Рост' },
    'landing.hero.optimized': { id: 'Produk Affiliate Teroptimasi AI', en: 'AI-Optimized Affiliate Products', zh: 'AI优化的联盟产品', ru: 'ИИ-оптимизированные продукты' },
    'landing.hero.readyNow': { id: 'High-Conversion Visual Ready', en: 'High-Conversion Visual Ready', zh: '高转化视觉准备就绪', ru: 'Визуал с высокой конверсией готов' },
    'landing.hero.autoDraft': { id: 'Auto-Drafting Viral Script', en: 'Auto-Drafting Viral Script', zh: '自动起草病毒脚本', ru: 'Авто-создание вирусных скриптов' },
    'landing.hero.following': { id: 'Mengikuti pola algoritma terbaru...', en: 'Following latest algorithm patterns...', zh: '遵循最新算法模式...', ru: 'Следуя последним алгоритмам...' },
    'landing.hero.contentGen': { id: 'Content Generated', en: 'Content Generated', zh: '已生成内容', ru: 'Контент создан' },
    'landing.hero.live': { id: 'LIVE', en: 'LIVE', zh: '实时', ru: 'LIVE' },
    'landing.hero.trendSync': { id: 'Market Trend Sync', en: 'Market Trend Sync', zh: '市场趋势同步', ru: 'Синхронизация трендов' },

    'landing.vision.label': { id: 'Visi Marketing 5.0', en: 'Marketing 5.0 Vision', zh: '营销5.0愿景', ru: 'Видение Маркетинга 5.0' },
    'landing.vision.title1': { id: 'Hentikan Kerja Repetitif.', en: 'Stop Repetitive Work.', zh: '停止重复工作。', ru: 'Остановите рутину.' },
    'landing.vision.title2': { id: 'Fokus ke', en: 'Focus on', zh: '专注于', ru: 'Сфокусируйтесь на' },
    'landing.vision.title3': { id: 'Strategi Pemenang.', en: 'Winning Strategy.', zh: '制胜策略。', ru: 'Победной Стратегии.' },
    'landing.vision.desc': { id: 'Affimate bukan hanya aplikasi, ini adalah ekosistem yang dirancang untuk membebaskan creator dari \'budak\' teknis. Kami memberdayakan sisi manusia lo untuk menjadi konseptor handal.', en: 'Affimate is not just an app, it\'s an ecosystem designed to free creators from technical slavery. We empower your human side to become a reliable conceptor.', zh: 'Affimate不仅仅是一个应用程序，它是一个旨在将创作者从技术奴役中解放出来的生态系统。我们赋予你人性化的一面成为可靠的概念设计师。', ru: 'Affimate — это не просто приложение, это экосистема, созданная для освобождения создателей от технического рабства. Мы помогаем вашей человеческой стороне стать надёжным концептором.' },

    'landing.toolkit.title': { id: 'The Ultimate', en: 'The Ultimate', zh: '终极', ru: 'Ваш' },
    'landing.toolkit.title2': { id: 'Affiliate Toolkit', en: 'Affiliate Toolkit', zh: '联盟工具包', ru: 'Партнёрский Инструментарий' },
    'landing.toolkit.subtitle': { id: 'Semua senjata dalam satu genggaman', en: 'All weapons in one hand', zh: '所有武器尽在掌握', ru: 'Все инструменты в одном месте' },

    'landing.feature1.title': { id: 'AI Character Center', en: 'AI Character Center', zh: 'AI角色中心', ru: 'ИИ Центр Персонажей' },
    'landing.feature1.desc': { id: 'Ciptakan persona digital yang konsisten. Wajah \'brand\' lo siap ngonten 24/7 tanpa perlu bayar talent mahal.', en: 'Create consistent digital personas. Your brand face is ready to create content 24/7 without paying expensive talents.', zh: '创建一致的数字角色。您的品牌形象随时准备24/7制作内容，无需支付昂贵的人才费用。', ru: 'Создавайте согласованные цифровые персонажи. Лицо вашего бренда готово создавать контент 24/7 без дорогих талантов.' },
    'landing.feature2.title': { id: 'AI Product Studio', en: 'AI Product Studio', zh: 'AI产品工作室', ru: 'ИИ Студия Продуктов' },
    'landing.feature2.desc': { id: 'Ubah foto produk affiliate biasa jadi katalog kelas dunia. Konversi naik karena visual yang menghipnotis.', en: 'Transform ordinary affiliate product photos into world-class catalogs. Conversions soar with mesmerizing visuals.', zh: '将普通的联盟产品照片转化为世界级目录。迷人的视觉效果提升转化率。', ru: 'Превратите обычные фото продуктов в каталоги мирового класса. Конверсия растёт с завораживающими визуалами.' },
    'landing.feature3.title': { id: 'Viral Script & VO', en: 'Viral Script & VO', zh: '病毒脚本和配音', ru: 'Вирусные Скрипты и VO' },
    'landing.feature3.desc': { id: 'Generate skrip dengan pola psikologi pembeli terbaru. Dilengkapi Voice-Over natural yang \'jualan banget\'.', en: 'Generate scripts with the latest buyer psychology patterns. Equipped with natural Voice-Over that really sells.', zh: '使用最新的买家心理模式生成脚本。配备自然的配音，真正推动销售。', ru: 'Генерируйте скрипты с последними паттернами психологии покупателя. С естественной озвучкой, которая продаёт.' },
    'landing.feature4.title': { id: 'VEO Visionary', en: 'VEO Visionary', zh: 'VEO远见者', ru: 'VEO Визионер' },
    'landing.feature4.desc': { id: 'Teknologi video futuristik yang dirancang untuk algoritma TikTok & Reels masa kini. Jadilah pioneer.', en: 'Futuristic video technology designed for today\'s TikTok & Reels algorithms. Be a pioneer.', zh: '专为当今TikTok和Reels算法设计的未来视频技术。成为先驱。', ru: 'Футуристичная видео-технология для алгоритмов TikTok и Reels. Будьте пионером.' },

    'landing.agility.title1': { id: 'Kecepatan', en: 'Speed', zh: '速度', ru: 'Скорость' },
    'landing.agility.title2': { id: 'Adalah', en: 'Is', zh: '是', ru: '—' },
    'landing.agility.title3': { id: 'Kunci Utama.', en: 'The Key.', zh: '关键。', ru: 'Ключ к успеху.' },
    'landing.agility.desc': { id: 'Dalam dunia affiliate, siapa yang paling cepat merespon tren adalah pemenang. Affimate memberi lo', en: 'In the affiliate world, whoever responds fastest to trends wins. Affimate gives you', zh: '在联盟世界中，谁最快响应趋势谁就赢了。Affimate给您', ru: 'В мире партнёрок побеждает тот, кто быстрее реагирует на тренды. Affimate даёт вам' },
    'landing.agility.word': { id: 'Agility', en: 'Agility', zh: '敏捷性', ru: 'Гибкость' },
    'landing.agility.desc2': { id: 'mutlak. Dari ide ke postingan cuma butuh hitungan detik.', en: 'absolute. From idea to post only takes seconds.', zh: '绝对的。从想法到发帖只需几秒钟。', ru: 'абсолютную. От идеи до публикации — считанные секунды.' },
    'landing.agility.join': { id: 'Bergabung dengan 5k+ Creator Masa Depan', en: 'Join 5k+ Future Creators', zh: '加入5000+未来创作者', ru: 'Присоединяйтесь к 5000+ создателям будущего' },
    'landing.agility.speed': { id: 'Production Speed', en: 'Production Speed', zh: '生产速度', ru: 'Скорость производства' },
    'landing.agility.reduction': { id: 'Manual Reduction', en: 'Manual Reduction', zh: '手动减少', ru: 'Сокращение ручного труда' },
    'landing.agility.liveSystem': { id: 'Live System', en: 'Live System', zh: '实时系统', ru: 'Живая система' },
    'landing.agility.latency': { id: 'Latency', en: 'Latency', zh: '延迟', ru: 'Задержка' },

    'landing.cta.title1': { id: 'Tentukan', en: 'Decide', zh: '决定', ru: 'Определите' },
    'landing.cta.title2': { id: 'Nasib Konten Lo.', en: 'Your Content\'s Fate.', zh: '您内容的命运。', ru: 'Судьбу своего контента.' },
    'landing.cta.desc': { id: 'Jangan biarkan kompetitor lo pake AI duluan. Ambil langkah hari ini.', en: 'Don\'t let your competitors use AI first. Take action today.', zh: '不要让竞争对手先使用AI。今天就行动起来。', ru: 'Не позволяйте конкурентам использовать ИИ первыми. Действуйте сегодня.' },
    'landing.cta.button': { id: 'Mulai Sekarang — FREE TRIAL', en: 'Start Now — FREE TRIAL', zh: '立即开始 - 免费试用', ru: 'Начать — БЕСПЛАТНАЯ ПРОБА' },

    'landing.footer.powered': { id: 'Powered by Axiamasi Strategy', en: 'Powered by Axiamasi Strategy', zh: '由Axiamasi Strategy提供支持', ru: 'При поддержке Axiamasi Strategy' },
    'landing.footer.privacy': { id: 'Privasi', en: 'Privacy', zh: '隐私', ru: 'Конфиденциальность' },
    'landing.footer.terms': { id: 'Ketentuan', en: 'Terms', zh: '条款', ru: 'Условия' },

    // ===== TOP UP MODAL =====
    'topup.title': { id: 'Top Up Saldo', en: 'Top Up Balance', zh: '充值余额', ru: 'Пополнить баланс' },
    'topup.balance': { id: 'Saldo Saat Ini', en: 'Current Balance', zh: '当前余额', ru: 'Текущий баланс' },
    'topup.selectPackage': { id: 'Pilih Paket', en: 'Select Package', zh: '选择套餐', ru: 'Выберите пакет' },
    'topup.customAmount': { id: 'Atau Masukkan Nominal Sendiri', en: 'Or Enter Custom Amount', zh: '或输入自定义金额', ru: 'Или введите свою сумму' },
    'topup.minAmount': { id: 'Minimal Rp 5.000', en: 'Minimum Rp 5,000', zh: '最低 Rp 5,000', ru: 'Минимум Rp 5,000' },
    'topup.youGet': { id: 'Kamu Dapat', en: 'You Get', zh: '您将获得', ru: 'Вы получите' },
    'topup.payNow': { id: 'Bayar Sekarang', en: 'Pay Now', zh: '立即支付', ru: 'Оплатить сейчас' },
    'topup.processing': { id: 'Memproses...', en: 'Processing...', zh: '处理中...', ru: 'Обработка...' },
    'topup.errorMin': { id: 'Minimal top up Rp 5.000', en: 'Minimum top up is Rp 5,000', zh: '最低充值 Rp 5,000', ru: 'Минимальное пополнение Rp 5,000' },
    'topup.description': { id: 'Saldo digunakan untuk generate konten AI. 1 USD ≈ 10 generasi foto.', en: 'Balance is used to generate AI content. 1 USD ≈ 10 photo generations.', zh: '余额用于生成AI内容。1美元 ≈ 10次图片生成。', ru: 'Баланс используется для генерации ИИ-контента. 1 USD ≈ 10 генераций фото.' },
    'topup.estimatedBalance': { id: 'Estimasi Saldo', en: 'Estimated Balance', zh: '预估余额', ru: 'Предварительный баланс' },
    'topup.totalPayment': { id: 'Total Pembayaran', en: 'Total Payment', zh: '总付款', ru: 'Итого к оплате' },
    'topup.paymentMethod': { id: 'Metode Pembayaran', en: 'Payment Method', zh: '支付方式', ru: 'Способ оплаты' },
    'topup.qris': { id: 'Scan via Dana, OVO, ShopeePay...', en: 'Scan via Dana, OVO, ShopeePay...', zh: '通过Dana, OVO, ShopeePay扫描...', ru: 'Сканируйте через Dana, OVO, ShopeePay...' },
    'topup.creditCard': { id: 'Kartu Kredit', en: 'Credit Card', zh: '信用卡', ru: 'Кредитная карта' },
    'topup.creditCardDesc': { id: 'Visa, Mastercard, JCB...', en: 'Visa, Mastercard, JCB...', zh: 'Visa, Mastercard, JCB...', ru: 'Visa, Mastercard, JCB...' },

    // ===== AFFILIATE =====
    'affiliate.title': { id: 'Program Afiliasi', en: 'Affiliate Program', zh: '联盟计划', ru: 'Партнёрская программа' },
    'affiliate.subtitle': { id: 'Undang teman, dapat cuan.', en: 'Invite friends, earn money.', zh: '邀请朋友，赚取佣金。', ru: 'Приглашайте друзей, зарабатывайте.' },
    'affiliate.earnings': { id: 'Total Pendapatan', en: 'Total Earnings', zh: '总收益', ru: 'Общий доход' },
    'affiliate.commission': { id: 'Komisi Kamu', en: 'Your Commission', zh: '您的佣金', ru: 'Ваша комиссия' },
    'affiliate.lifetime': { id: 'Seumur Hidup / User', en: 'Lifetime / User', zh: '终身 / 用户', ru: 'Пожизненно / Пользователь' },
    'affiliate.yourLink': { id: 'Link Referral Kamu', en: 'Your Referral Link', zh: '您的推荐链接', ru: 'Ваша реферальная ссылка' },
    'affiliate.copyHint': { id: 'Klik untuk menyalin link. Bagikan ke temanmu!', en: 'Click to copy link. Share it with friends!', zh: '点击复制链接，分享给朋友！', ru: 'Нажмите, чтобы скопировать. Поделитесь с друзьями!' },
    'affiliate.haveCode': { id: 'Punya Kode Undangan?', en: 'Have an Invite Code?', zh: '有邀请码吗？', ru: 'Есть код приглашения?' },
    'affiliate.enterCode': { id: 'Masukkan kode temanmu...', en: 'Enter friend\'s code...', zh: '输入朋友的邀请码...', ru: 'Введите код друга...' },
    'affiliate.linkCopied': { id: 'Link referral disalin!', en: 'Referral link copied!', zh: '推荐链接已复制！', ru: 'Реферальная ссылка скопирована!' },
    'affiliate.success': { id: 'Referral berhasil diaktifkan!', en: 'Referral activated!', zh: '推荐激活成功！', ru: 'Реферал активирован!' },
    'affiliate.alreadyReferred': { id: 'Kamu sudah pernah memasukkan kode referral.', en: 'You already entered a referral code.', zh: '您已经输入过推荐码。', ru: 'Вы уже вводили реферальный код.' },
    'affiliate.invalidCode': { id: 'Kode referral tidak ditemukan.', en: 'Referral code not found.', zh: '未找到推荐码。', ru: 'Реферальный код не найден.' },
    'affiliate.selfReferral': { id: 'Tidak bisa memasukkan kode sendiri.', en: 'Cannot use your own code.', zh: '不能使用自己的推荐码。', ru: 'Нельзя использовать собственный код.' },

    // ===== HEADER / NAV =====
    'header.topup': { id: 'Top Up', en: 'Top Up', zh: '充值', ru: 'Пополнить' },
    'header.affiliate': { id: 'Afiliasi', en: 'Affiliate', zh: '联盟', ru: 'Партнёрка' },
    'header.logout': { id: 'Keluar Sesi', en: 'Logout', zh: '退出登录', ru: 'Выйти' },
    'header.freePlan': { id: 'Free Plan', en: 'Free Plan', zh: '免费计划', ru: 'Бесплатный план' },
    'header.proMember': { id: 'Pro Member', en: 'Pro Member', zh: 'Pro会员', ru: 'Pro участник' },

    // ===== PANELS =====
    'panel.character': { id: 'Karakter', en: 'Character', zh: '角色', ru: 'Персонаж' },
    'panel.studio': { id: 'Foto Studio', en: 'Photo Studio', zh: '照片工作室', ru: 'Фотостудия' },
    'panel.script': { id: 'Skrip & VO', en: 'Script & VO', zh: '脚本和配音', ru: 'Скрипт и VO' },
    'panel.veo': { id: 'VEO Vision', en: 'VEO Vision', zh: 'VEO 视觉', ru: 'VEO Vision' },
    'panel.generate': { id: 'Generate', en: 'Generate', zh: '生成', ru: 'Генерировать' },
    'panel.cost': { id: 'Biaya', en: 'Cost', zh: '费用', ru: 'Стоимость' },
    'panel.generating': { id: 'Generating...', en: 'Generating...', zh: '生成中...', ru: 'Генерация...' },

    // ===== CHARACTER PANEL =====
    'char.title': { id: 'MEMBUAT KARAKTER AI', en: 'CREATE AI CHARACTER', zh: '创建AI角色', ru: 'СОЗДАТЬ ИИ ПЕРСОНАЖА' },
    'char.subtitle': { id: 'Buat persona AI unik untuk brand kamu', en: 'Create unique AI persona for your brand', zh: '为您的品牌创建独特的AI角色', ru: 'Создайте уникальный ИИ-персонаж для бренда' },
    'char.gender': { id: 'Gender (Basic)', en: 'Gender (Basic)', zh: '性别（基础）', ru: 'Пол (Базовый)' },
    'char.male': { id: 'Pria', en: 'Male', zh: '男', ru: 'Мужской' },
    'char.female': { id: 'Wanita', en: 'Female', zh: '女', ru: 'Женский' },
    'char.detailSection': { id: 'DETAIL KARAKTER', en: 'CHARACTER DETAILS', zh: '角色详情', ru: 'ДЕТАЛИ ПЕРСОНАЖА' },
    'char.style': { id: 'Visual Style', en: 'Visual Style', zh: '视觉风格', ru: 'Визуальный стиль' },
    'char.age': { id: 'Umur (Age)', en: 'Age', zh: '年龄', ru: 'Возраст' },
    'char.ethnicity': { id: 'Ras / Etnis', en: 'Race / Ethnicity', zh: '种族', ru: 'Раса / Этнос' },
    'char.hairStyle': { id: 'Gaya Rambut', en: 'Hair Style', zh: '发型', ru: 'Причёска' },
    'char.hairColor': { id: 'Warna Rambut', en: 'Hair Color', zh: '发色', ru: 'Цвет волос' },
    'char.bodyType': { id: 'Bentuk Tubuh', en: 'Body Type', zh: '体型', ru: 'Телосложение' },
    'char.outfit': { id: 'Gaya Pakaian', en: 'Outfit Style', zh: '服装风格', ru: 'Стиль одежды' },
    'char.activity': { id: 'Aktivitas & Lokasi (Opsional)', en: 'Activity & Location (Optional)', zh: '活动和位置（可选）', ru: 'Активность и локация (Опционально)' },
    'char.activityPlaceholder': { id: 'Isi sesuai keinginan mu...', en: 'Type your preference...', zh: '输入你的偏好...', ru: 'Введите ваши предпочтения...' },
    'char.generateBtn': { id: 'Generate Character', en: 'Generate Character', zh: '生成角色', ru: 'Генерировать персонажа' },
    'char.empty': { id: 'Karakter Kosong', en: 'No Character', zh: '无角色', ru: 'Нет персонажа' },
    'char.emptyHint': { id: 'Isi detail dan mulai generate', en: 'Fill details and start generating', zh: '填写详情并开始生成', ru: 'Заполните детали и начните генерацию' },

    // ===== IMAGE PANEL =====
    'image.title': { id: 'AI Product Studio', en: 'AI Product Studio', zh: 'AI产品工作室', ru: 'ИИ Студия Продуктов' },
    'image.subtitle': { id: 'Ubah foto produk biasa jadi foto katalog premium', en: 'Transform ordinary product photos into premium catalog shots', zh: '将普通产品照片转化为高级目录照片', ru: 'Превратите обычные фото продуктов в премиальные' },
    'image.upload': { id: 'Upload Foto Produk', en: 'Upload Product Photo', zh: '上传产品照片', ru: 'Загрузить фото продукта' },
    'image.dragDrop': { id: 'Drag & drop atau klik untuk upload', en: 'Drag & drop or click to upload', zh: '拖放或点击上传', ru: 'Перетащите или нажмите для загрузки' },
    'image.theme': { id: 'Tema', en: 'Theme', zh: '主题', ru: 'Тема' },
    'image.lighting': { id: 'Pencahayaan', en: 'Lighting', zh: '灯光', ru: 'Освещение' },
    'image.angle': { id: 'Sudut Kamera', en: 'Camera Angle', zh: '相机角度', ru: 'Угол камеры' },
    'image.generateBtn': { id: 'Sulap Jadi Foto Studio', en: 'Transform to Studio Photo', zh: '转换为工作室照片', ru: 'Превратить в студийное фото' },
    'image.massMode': { id: 'Mode Mass Generate', en: 'Mass Generate Mode', zh: '批量生成模式', ru: 'Режим массовой генерации' },

    // ===== SCRIPT PANEL =====
    'script.title': { id: 'Viral Script Engine', en: 'Viral Script Engine', zh: '病毒脚本引擎', ru: 'Движок Вирусных Скриптов' },
    'script.subtitle': { id: 'Generate skrip yang bikin orang beli', en: 'Generate scripts that make people buy', zh: '生成让人购买的脚本', ru: 'Генерируйте скрипты, которые продают' },
    'script.platform': { id: 'Platform', en: 'Platform', zh: '平台', ru: 'Платформа' },
    'script.category': { id: 'Kategori', en: 'Category', zh: '类别', ru: 'Категория' },
    'script.tone': { id: 'Nada', en: 'Tone', zh: '语调', ru: 'Тон' },
    'script.duration': { id: 'Durasi', en: 'Duration', zh: '时长', ru: 'Длительность' },
    'script.generateBtn': { id: 'Generate Script', en: 'Generate Script', zh: '生成脚本', ru: 'Генерировать скрипт' },
    'script.ttsBtn': { id: 'Generate Suara (TTS)', en: 'Generate Voice (TTS)', zh: '生成语音 (TTS)', ru: 'Генерировать голос (TTS)' },
    'script.copyScript': { id: 'Salin Script', en: 'Copy Script', zh: '复制脚本', ru: 'Скопировать скрипт' },

    // ===== VEO PANEL =====
    'veo.title': { id: 'VEO Visionary', en: 'VEO Visionary', zh: 'VEO远见者', ru: 'VEO Визионер' },
    'veo.subtitle': { id: 'Buat prompt video AI yang powerful', en: 'Create powerful AI video prompts', zh: '创建强大的AI视频提示', ru: 'Создавайте мощные ИИ-промпты для видео' },
    'veo.uploadRef': { id: 'Upload Referensi (Opsional)', en: 'Upload Reference (Optional)', zh: '上传参考（可选）', ru: 'Загрузить референс (Опционально)' },
    'veo.style': { id: 'Gaya Video', en: 'Video Style', zh: '视频风格', ru: 'Стиль видео' },
    'veo.shot': { id: 'Jenis Shot', en: 'Shot Type', zh: '镜头类型', ru: 'Тип кадра' },
    'veo.camera': { id: 'Gerakan Kamera', en: 'Camera Movement', zh: '相机运动', ru: 'Движение камеры' },
    'veo.generateBtn': { id: 'Buat Prompt Video', en: 'Create Video Prompt', zh: '创建视频提示', ru: 'Создать промпт для видео' },
    'veo.copyPrompt': { id: 'Salin Prompt', en: 'Copy Prompt', zh: '复制提示', ru: 'Скопировать промпт' },

    // ===== FOMO =====
    'fomo.bought': { id: 'membeli', en: 'purchased', zh: '购买了', ru: 'купил(а)' },
    'fomo.minutesAgo': { id: 'menit yang lalu', en: 'minutes ago', zh: '分钟前', ru: 'минут назад' },

    // ===== TOASTS =====
    'toast.insufficientBalance': { id: 'Saldo tidak cukup! Silakan top-up.', en: 'Insufficient balance! Please top-up.', zh: '余额不足！请充值。', ru: 'Недостаточно средств! Пополните баланс.' },
    'toast.generationSuccess': { id: 'Berhasil generate!', en: 'Generation successful!', zh: '生成成功！', ru: 'Генерация успешна!' },
    'toast.copySuccess': { id: 'Berhasil disalin!', en: 'Copied successfully!', zh: '复制成功！', ru: 'Скопировано!' },
    'toast.logoutSuccess': { id: 'Berhasil logout', en: 'Logged out successfully', zh: '成功登出', ru: 'Выход выполнен' },
    'toast.trialGranted': { id: '🎁 Free Trial Active: $0.35 Granted!', en: '🎁 Free Trial Active: $0.35 Granted!', zh: '🎁 免费试用激活：已获得$0.35！', ru: '🎁 Бесплатная проба активна: $0.35 начислено!' },
    'toast.redirectPayment': { id: 'Mengarahkan ke halaman pembayaran...', en: 'Redirecting to payment page...', zh: '正在跳转到支付页面...', ru: 'Перенаправление на страницу оплаты...' },
    'toast.paymentError': { id: 'Gagal memproses pembayaran. Silakan coba lagi.', en: 'Failed to process payment. Please try again.', zh: '付款处理失败。请重试。', ru: 'Ошибка обработки платежа. Попробуйте снова.' },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('id');

    const t = (key: string): string => {
        const translation = translations[key];
        if (!translation) {
            console.warn(`Missing translation for key: ${key}`);
            return key;
        }
        return translation[language] || translation['en'] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
