/*
 * PhysModel 360 — kontent ma’lumotlari.
 *
 * sections: 13 ta platforma bo‘limi.
 *   t — nomi, v — vazifasi, q — umumiy ishlash tartibi,
 *   d — interaktiv demo turi: "sim", "lab", "formula", "test", "comp" yoki null.
 *
 * topics: FO‘M seminar mavzulari (16 ta).
 *   t — mavzu nomi, h — soat (noma’lum bo‘lsa null),
 *   demos — shu mavzuda ko‘rsatiladigan demolar ("sim", "lab", "formula"),
 *   m — har bir bo‘lim uchun mavzuga oid matn: { bo‘lim_indeksi: ["abzas", "abzas"] }
 *       Indeks 0 dan boshlanadi (0 = STEAM ta’limi ... 12 = Kompetensiya xaritasi).
 *       Kiritilmagan bo‘limlar sahifada "kiritilmagan" deb ko‘rinadi.
 *
 * questions: test savollari. a — to‘g‘ri javob indeksi (0 dan), topic — kompetensiya yo‘nalishi.
 */
window.PM360 = {
  categories: [
    {k:"mex",  n:"Mexanika", i:"⚙️", c:"#C9A227", v:"Harakat, kuch va muvozanat qonunlari."},
    {k:"elek", n:"Elektr va magnetizm", i:"⚡", c:"#D98E04", v:"Tok, kuchlanish, qarshilik va magnit maydon."},
    {k:"opt",  n:"Optika", i:"🌈", c:"#A8703A", v:"Yorug‘likning qaytishi, sinishi va linzalar."},
    {k:"term", n:"Molekulyar fizika va termodinamika", i:"🔥", c:"#B5894E", v:"Gaz qonunlari, issiqlik va termodinamika qonunlari."},
    {k:"atom", n:"Atom va yadro fizikasi", i:"☢️", c:"#6E4A6B", v:"Atom modellari va radioaktivlik."},
    {k:"umum", n:"Metodika va xalqaro baholash", i:"📚", c:"#9A7412", v:"Fizika o‘qitish metodikasi va PISA dasturi."}
  ],
  // har bir mavzu qaysi bo‘limga tegishli (topics bilan bir xil tartibda)
  topicCat: ["mex","mex","mex","term","term","elek","elek","elek","elek","elek","opt","opt","atom","atom","umum","umum"],
  sections: [
    {t:"Fizika nazariyasi", v:"Mavzuning asosiy tushunchalari, qonunlari, hodisalari va atamalarini tizimli o‘rgatadi.", q:"Qisqa matn, ta’rif, qonun va misol ko‘rinishida beriladi. Oxirida o‘zlashtirishni tekshirish savollari bo‘lishi mumkin.", d:null},
    {t:"Videodarslar", v:"Mavzuni ovoz, tasvir, animatsiya va amaliy misollar yordamida tushuntiradi.", q:"Darsni tanlab ijro etasiz. Videoni to‘xtatish, davom ettirish yoki qayta ko‘rish mumkin. Ostida konspekt va nazorat savollari bo‘ladi.", d:null},
    {t:"Infografikalar", v:"Katta hajmdagi ma’lumotni matn, belgi, chizma va diagrammalar orqali tez tushunishga yordam beradi.", q:"Asosiy tushunchalar, formulalar, birliklar va jarayonlar vizual tartibda ko‘rsatiladi. Rasmni kattalashtirib ko‘rish mumkin.", d:null},
    {t:"Virtual laboratoriya", v:"Haqiqiy jihozlar bo‘lmaganda ham tajribalarni xavfsiz virtual muhitda bajarish imkonini beradi.", q:"Tajribani tanlaysiz, parametrlarni kiritib boshlaysiz. Natijalarni jadvalga yozib, xulosa chiqarasiz.", d:"lab"},
    {t:"Fizik modellashtirish", v:"Fizik jarayonning soddalashtirilgan modelini yaratib, uning ishlashini o‘rganishga xizmat qiladi.", q:"Model tanlanadi, boshlang‘ich qiymatlar kiritiladi. Natija son, grafik yoki harakat ko‘rinishida chiqadi.", d:"model"},
    {t:"Interaktiv simulyatsiyalar", v:"Parametrlarni o‘zgartirib, sabab bilan natija orasidagi bog‘liqlikni ko‘rish imkonini beradi.", q:"Slayder yoki tugmalar orqali parametr o‘zgartiriladi, harakat yoki natija darhol yangilanadi.", d:"sim"},
    {t:"STEAM topshiriqlari", v:"Bilimni amaliy vazifalarda qo‘llash, muammoni hal qilish va jamoada ishlash ko‘nikmalarini rivojlantiradi.", q:"Har bir topshiriqda maqsad, shart, vositalar, bosqichlar va baholash mezonlari beriladi. Natija yoki loyiha taqdim etiladi.", d:null},
    {t:"Loyiha ishlari", v:"Mavzu doirasida mustaqil yoki guruh bo‘lib ishlash imkonini beradi.", q:"Mavzu tanlanadi yoki g‘oya taklif qilinadi, reja tuziladi, ma’lumot to‘planadi, tajriba yoki model yaratiladi va natija taqdim etiladi.", d:null},
    {t:"Fizik formulalar", v:"Mavzuga oid formulalar, kattaliklar belgilari, SI birliklari va qo‘llanish misollarini jamlaydi.", q:"Qidiruv orqali formula topiladi. Har bir formula yonida izoh, birliklar va qisqa misol beriladi.", d:"formula"},
    {t:"Test va baholash", v:"Mavzu bo‘yicha bilimni tekshiradi va qayta o‘rganish kerak bo‘lgan joylarni ko‘rsatadi.", q:"Test savollariga javob berasiz. Tizim ballni, to‘g‘ri javoblarni va xato javoblar bo‘yicha izohni ko‘rsatadi.", d:"test"},
    {t:"Kompetensiya xaritasi", v:"Bilim, amaliy ko‘nikma va kompetensiyalar qay darajada shakllanganini ko‘rsatadi.", q:"Testlar va topshiriqlar natijalari jamlanadi. Har bir yo‘nalish bo‘yicha o‘zlashtirish foizi ko‘rsatiladi.", d:"comp"},
    {t:"Amaliy ahamiyati", v:"Kinematika bilimi hayotda, texnikada va kasblarda qayerda kerak bo‘lishini ko‘rsatadi.", q:"Mavzuning real hayotdagi misollari va qo‘llanish sohalari.", d:null},
    {t:"PISA savollari va baholash", v:"PISA uslubidagi savollar va ball asosidagi daraja.", q:"Savollarga javob bering, ballar yig‘iladi va daraja aniqlanadi.", d:"pisa"}
  ],

  topics: [
    {
      t:"Kinematikaning asosiy tushunchalari va ularni shakllantirishning ilmiy-metodik tahlili", h:4,
      demos:["sim","uniform","formula","model","pisa"], lab:"uniform",
      pisa:{"items": [{"q": "Avtobus 60 km/h tezlik bilan 30 minut yuradi. U qancha masofa bosib o‘tadi?", "o": ["15 km", "30 km", "60 km", "120 km"], "p": [0, 2, 0, 0]}, {"q": "Jism 4 s davomida tekis tezlanib, tezligi 0 dan 8 m/s gacha ortdi. Uning tezlanishi necha m/s² bo‘ladi?", "o": ["2 m/s²", "4 m/s²", "8 m/s²", "32 m/s²"], "p": [2, 0, 0, 0]}, {"q": "Aravacha 10 s da 20 m, keyingi 10 s da 40 m yo‘l bosdi. Bu harakat haqida nima deyish mumkin?", "o": ["Tekis harakat, tezligi 2 m/s", "Tekis harakat, tezligi 4 m/s", "Harakat tekis emas: tezlik 2 m/s dan 4 m/s ga oshgan", "Tezlik 6 m/s ga teng"], "p": [0, 0, 2, 0]}], "levels": [{"min": 0, "key": "pisa_l1"}, {"min": 3, "key": "pisa_l2"}, {"min": 5, "key": "pisa_l3"}]},
      // YouTube video darslar: {t: "sarlavha", url: "https://www.youtube.com/watch?v=..."}
      videos:[
        {t:"Mexanika. Kinematika asoslari", url:"https://youtu.be/8fDjyI4u2iA?si=sMtkeUvNDQbeJwgd"}
      ],
      formulas:[
        {n:"Tekis harakat yo‘li", f:"s = v · t", u:"m"},
        {n:"Tezlik", f:"v = s / t", u:"m/s"},
        {n:"Tezlanish", f:"a = (v − v₀) / t", u:"m/s²"},
        {n:"Tekis tezlanuvchan harakat tezligi", f:"v = v₀ + a · t", u:"m/s"},
        {n:"Tekis tezlanuvchan harakat yo‘li", f:"s = v₀ · t + a · t² / 2", u:"m"},
        {n:"Erkin tushish balandligi", f:"h = g · t² / 2", u:"m"}
      ],
      questions:[
        {q:"Velosipedchi 4 m/s tezlik bilan 30 s harakat qildi. Bosib o‘tgan yo‘li necha metr?", o:["7,5 m","34 m","120 m","1,2 m"], a:2, topic:"Tekis harakat"},
        {q:"Boshlang‘ich tezlik 0, tezlanish 2 m/s². 5 s dan keyin tezlik necha m/s bo‘ladi?", o:["2,5 m/s","10 m/s","4 m/s","25 m/s"], a:1, topic:"Tekis tezlanuvchan"},
        {q:"Tekis harakatning s–t grafigi qanday ko‘rinishda bo‘ladi (boshi koordinata boshida)?", o:["Parabola","Koordinata boshidan o‘tuvchi og‘ma to‘g‘ri chiziq","Gorizontal to‘g‘ri chiziq","Aylana"], a:1, topic:"Grafiklar"},
        {q:"Erkin tushishda 2 s dan keyin tezlik taxminan necha m/s bo‘ladi (g ≈ 9,8 m/s²)?", o:["4,9 m/s","19,6 m/s","9,8 m/s","2 m/s"], a:1, topic:"Erkin tushish"}
      ],
      m:{
        0:[],
        1:[],
        2:["Infografikada uchta asosiy kattalik ko‘rsatilgan: yo‘l (m), tezlik (m/s) va tezlanish (m/s²). Har biri o‘z rangi bilan ajratilgan va formulasi yonida yozilgan.", "Tekis harakat grafigi: tezlik vaqt o‘tishi bilan o‘zgarmaydi (gorizontal to‘g‘ri chiziq), yo‘l esa to‘g‘ri chiziq bo‘ylab ortadi. Tekis tezlanuvchan harakatda tezlik to‘g‘ri chiziq bo‘ylab, yo‘l esa parabola bo‘ylab o‘sadi.", "Infografikani telefonda kattalashtirib, har bir belgini alohida o‘qish mumkin."],
        3:[],
        4:["Model: jism o‘zgarmas tezlanish bilan harakatlanadi, deb faraz qilinadi. Boshlang‘ich tezlik, tezlanish va vaqt kiritiladi, model esa tezlik va yo‘lni hisoblaydi.", "Erkin tushish — tezlanishi g = 9,8 m/s² bo‘lgan tekis tezlanuvchan harakatning xususiy holi. Havo qarshiligi hisobga olinmaydi, bu model uchun kiritilgan soddalashtirish.", "Modelning chegarasi: katta tezliklarda havo qarshiligi sezilarli bo‘ladi, shuning uchun model past balandlikdagi jismlar uchun yaroqli."],
        5:["Simulyatsiyada balandlik slayderi orqali jismni qancha balandlikdan tashlashni tanlaysiz. Tushish vaqti t = √(2h / g) va yerga tegish tezligi v = √(2gh) darhol hisoblanadi.", "Tajriba: balandlikni 4 marta oshiring va tushish vaqti 2 marta ortishini kuzating (t ∝ √h). Animatsiyani «Tushirish» tugmasi bilan ishga tushiring.", "Bu bo‘limda sabab va natija bog‘liqligi amalda ko‘rinadi: balandlik oshsa, tezlik ham oshadi, lekin tezlik balandlikka emas, uning kvadrat ildiziga proporsional."],
        6:["1-topshiriq: 10 m masofani belgilang va aravachaning tezligini o‘lchang. Shart: start va finishda vaqtni qayd eting. Natija: v = s / t, birligi m/s.", "2-topshiriq: 36 km/h tezlik bilan 10 s harakatlangan avtomobil qancha yo‘l bosadi? Birliklarni o‘tkazing: 36 km/h = 10 m/s, so‘ng s = v · t.", "3-topshiriq: erkin tushish balandligini 5 m deb oling, tushish vaqtini hisoblang (t = √(2h / g)) va natijani haqiqiy o‘lchov bilan solishtiring.", "Baholash mezoni: birliklarni to‘g‘ri o‘tkazish, formulani to‘g‘ri tanlash, hisob-kitob va xulosa."],
        7:["Loyiha mavzusi: «Maktab yo‘lagidagi tezlik». O‘quvchilar 10 m masofani belgilab, o‘z yurish tezligini o‘lchaydi va natijalarni solishtiradi.", "Reja: 1) masofani belgilash; 2) har bir o‘quvchi uch marta o‘lchash; 3) o‘rtacha tezlikni hisoblash; 4) natijalarni jadval va grafikda ko‘rsatish; 5) xulosa va taqdimot.", "Taqdimot: rasm, jadval va qisqa xulosadan iborat hisobot. Loyiha natijasi sinf oldida ko‘rsatiladi."],
        8:["Bu bo‘limda kinematika formulalari jamlangan. Qidiruv maydoniga «tezlik» yoki «tezlanish» deb yozing. Har bir formula yonida birligi ko‘rsatilgan.", "Formulalarni yodlashdan oldin ma’nosini tushuning: s = v · t tekis harakatdagi yo‘l, v = v₀ + a · t esa tezlanish bilan o‘zgaruvchi tezlik."],
        9:["Testda 4 ta savol bor: tekis harakat, tekis tezlanuvchan harakat, grafiklar va erkin tushish. Javoblarni tanlab «Natijani ko‘rish» tugmasini bosing.", "Xato javoblar uchun to‘g‘ri javob ko‘rsatiladi. Natija 3 ta va undan yuqori bo‘lsa, keyingi mavzuga o‘tish tavsiya etiladi."],
        10:["Kompetensiya xaritasi testdagi yo‘nalishlar bo‘yicha o‘zlashtirish foizini ko‘rsatadi: tekis harakat, tekis tezlanuvchan harakat, grafiklar va erkin tushish.", "Foiz past bo‘lsa, shu yo‘nalish bo‘limiga qaytib, nazariya va videoni qayta ko‘ring, so‘ng testni yana topshiring."],
        11:["Kinematika — harakatni o‘lchash va oldindan aytish fani. Transport tezligini, yo‘lga ketadigan vaqtni va sport natijalarini hisoblash uning formulalariga asoslanadi.", "Misollar: avtomobilning tormozlanish masofasi (xavfsizlik), yugurish tezligi, liftning harakati, poyezd va samolyot jadvali, o‘quvchining maktabga yetib borish vaqti.", "Texnika: spidometr, avtomatik boshqaruv tizimlari va robotlarning yo‘lini hisoblash harakat grafiklariga asoslanadi. Haydovchi, muhandis, sportchi murabbiyi va astronom kasblarida bu bilim doim kerak bo‘ladi."],
        12:["PISA — o‘quvchilarning bilimni hayotiy vaziyatda qo‘llash qobiliyatini baholovchi xalqaro test. Savollar yodlashga emas, tushunish va qo‘llashga qaratilgan.", "Quyida kinematikaga oid 3 ta PISA uslubidagi savol bor. Har bir to‘g‘ri javob ball beradi, jami ball darajani belgilaydi: 0–2 ball — past, 3–4 ball — o‘rta, 5–6 ball — yuqori daraja."]
      }
    },
    {t:"Dinamikaning asosiy tushunchalari va qonunlarini kiritish ketma-ketligi va metodik yondashuvlar", h:4, demos:[], m:{
        0:["Dinamika — jismlar harakatining sabablarini, ya’ni kuchlarni o‘rganadigan mexanika bo‘limi. Kinematika harakatni tasvirlasa, dinamika jism nima uchun aynan shunday harakat qilishini tushuntiradi.", "Kuch — jismlarning bir-biriga ta’sirini tavsiflovchi vektor kattalik. SI birligi — nyuton (N). 1 N — 1 kg massali jismga 1 m/s² tezlanish beradigan kuch: 1 N = 1 kg · m/s².", "Massa — jismning inertligi, ya’ni tezligini o‘zgartirishga qarshiligining o‘lchovi. Birligi — kilogramm (kg). Massa skalyar kattalik.", "Nyutonning I qonuni (inersiya qonuni): agar jismga boshqa jismlar kuch bilan ta’sir etmasa yoki ta’sirlar o‘zaro muvozanatlashsa, jism tinch yoki tekis to‘g‘ri chiziqli harakatda bo‘ladi.", "Nyutonning II qonuni: jism tezlanishi unga ta’sir etuvchi natijaviy kuchga to‘g‘ri, massasiga teskari proporsional: a = F / m, ya’ni F = m · a. Tezlanish kuch yo‘nalishida bo‘ladi.", "Nyutonning III qonuni: ta’sir va aks ta’sir kuchlari teng, qarama-qarshi yo‘nalgan va turli jismlarga qo‘yilgan: F₁₂ = −F₂₁. Masalan, ot aravani tortganda arava ham otni orqaga tortadi.", "Og‘irlik kuchi: P = m · g, Yer yuzida g ≈ 9,8 m/s². Og‘irlik kuchi Yerning jismga tortish kuchi bo‘lib, tayanch yoki osma ustida namoyon bo‘ladi.", "Ishqalanish kuchi: F = μ · N, bu yerda μ — ishqalanish koeffitsienti, N — tayanch reaksiya kuchi. Ishqalanish kuchi harakatga qarshi yo‘naladi.", "Elastiklik kuchi (Guk qonuni): F = k · x, bu yerda k — qattiqlik, x — deformatsiya (cho‘zilish yoki siqilish). Prujinada kuch cho‘zilishga to‘g‘ri proporsional.", "Impuls: p = m · v, birligi kg · m/s. Yopiq sistemada jismlarning umumiy impulsi o‘zgarmaydi (impulsning saqlanish qonuni).", "Masala yechish tartibi: 1) jismga ta’sir etuvchi barcha kuchlarni chizing; 2) koordinata o‘qini tanlang; 3) natijaviy kuchni toping; 4) Nyutonning II qonunini yozing; 5) hisoblang va birliklarni tekshiring.", "Misol: 2 kg massali jismga 10 N kuch ta’sir etsa, a = F / m = 10 / 2 = 5 m/s²."],
        1:["Video darsda Nyuton qonunlari aravacha, prujina va osilgan yuk bilan tajribalarda ko‘rsatiladi. Har bir qonun uchun qisqa namoyish va hisob-kitob beriladi.", "Video ostida konspekt va uchta nazorat savoli bo‘ladi."],
        2:["Infografikada uchta Nyuton qonuni, kuch turlari (og‘irlik, ishqalanish, elastiklik) va birliklar jadvali beriladi.", "Har bir kuchning yo‘nalishi strelka bilan ko‘rsatiladi."],
        3:["Virtual laboratoriyada aravachaga turli massali yuk qo‘yiladi va bir xil kuch bilan tortiladi. Tezlanish o‘lchanib, F = m · a qonuniyati tekshiriladi.", "Tartib: massani o‘zgartiring, kuchni saqlang, tezlanishni hisoblang va jadvalga yozing. Xulosani o‘zingiz yozing."],
        4:["Model: jismga ta’sir etuvchi kuchlarning yig‘indisi (natijaviy kuch) aniqlanadi va Nyutonning II qonuni orqali tezlanish hisoblanadi.", "Agar ishqalanish modelga kiritilsa, natijaviy kuch F − μmg ga teng bo‘ladi, bu esa tezlanishni kamaytiradi."],
        5:["Simulyatsiyada kuch va massa slayderlari orqali tezlanish qanday o‘zgarishini kuzatasiz: kuch oshsa tezlanish oshadi, massa oshsa tezlanish kamayadi."],
        6:["1-topshiriq: 1 kg va 2 kg massali yuklar bilan bir xil kuchda tajriba o‘tkazing. Qaysi biri kamroq tezlanadi va nega?", "2-topshiriq: havoda sekin tushadigan parashyut modelini yasang va havo qarshiligi qanday kuch ekanini tushuntiring.", "Baholash mezoni: kuchlarni to‘g‘ri chizish, formulani to‘g‘ri qo‘llash va xulosa."],
        7:["Loyiha mavzusi: «Xavfsiz to‘xtash». O‘quvchilar aravachaning to‘xtash masofasi massa va tezlikka qanday bog‘liqligini tekshiradi.", "Reja: 1) gipoteza yozish; 2) massa va tezlikni o‘zgartirish; 3) to‘xtash masofasini o‘lchash; 4) grafik va xulosa; 5) taqdimot."],
        8:["Formulalar: F = m · a; P = m · g; F = μ · N; F = k · x; p = m · v. Qidiruv maydoniga «kuch» yoki «impuls» deb yozing."],
        9:["Testda Nyuton qonunlari, og‘irlik va ishqalanish kuchi bo‘yicha savollar bo‘ladi. Javobni tanlab «Natijani ko‘rish» tugmasini bosing."],
        10:["Kompetensiya xaritasi Nyuton qonunlari, kuchlar va impuls bo‘yicha o‘zlashtirishni ko‘rsatadi. Past foiz bo‘lsa, nazariya bo‘limiga qaytib, masala yechishni takrorlang."]
      }},
    {t:"Statika bo‘limini o‘qitish metodikasi", h:2, demos:[], m:{}},
    {t:"«Temperatura. Gaz qonunlari» mavzusini o‘tish metodikasi", h:4, demos:[], m:{}},
    {t:"Termodinamika qonunlari mavzusini o‘qitish metodikasi", h:2, demos:[], m:{}},
    {t:"«Suyuqliklarda elektr toki» mavzusini o‘tish metodikasi", h:4, demos:["formula"], m:{}},
    {t:"O‘zgarmas tok qonunlari mavzusini o‘qitish metodikasi", h:null, demos:["formula"], m:{}},
    {t:"Magnit hodisalari", h:null, demos:[], m:{}},
    {t:"O‘zgaruvchan tok qonunlari mavzusini o‘qitish metodikasi", h:null, demos:["lab"], m:{}},
    {t:"Faradey qonunlari. Elektroliz va uning qo‘llanilishi mavzusini o‘tish metodikasi", h:null, demos:[], m:{}},
    {t:"«Linzalar. Linza formulasi. Linzaning optik kuchi. Linzada tasvir yasash» mavzusini o‘tish metodikasi", h:null, demos:["formula"], m:{}},
    {t:"«Yorug‘likning qaytish va sinish qonunlari» mavzusini o‘tish metodikasi", h:null, demos:["sim"], m:{}},
    {t:"Atom modellari", h:null, demos:[], m:{}},
    {t:"«Radioaktivlikning kashf etilishi». Siljish qoidasi mavzusini o‘tish metodikasi", h:null, demos:[], m:{}},
    {t:"«Olamning yagona fizik manzarasi» mavzusini o‘tish metodikasi", h:null, demos:[], m:{}},
    {t:"PISA ta’lim sifatini xalqaro baholash tizimi dasturi va uning fizika o‘qitishdagi ahamiyati", h:null, demos:[], m:{}}
  ],

  formulas: [
    {n:"Tezlik", f:"v = s / t", u:"m/s"},
    {n:"Tezlanish", f:"a = (v − v₀) / t", u:"m/s²"},
    {n:"Nyutonning II qonuni", f:"F = m · a", u:"N"},
    {n:"Og‘irlik kuchi", f:"P = m · g", u:"N"},
    {n:"Kinetik energiya", f:"Eₖ = m · v² / 2", u:"J"},
    {n:"Quvvat", f:"P = A / t", u:"W"},
    {n:"Ohm qonuni", f:"U = I · R", u:"V"},
    {n:"Matematik mayatnik davri", f:"T = 2π√(L / g)", u:"s"}
  ],

  questions: [
    {q:"Jism 10 m/s o‘zgarmas tezlik bilan 5 s harakat qilsa, bosib o‘tgan yo‘li necha metr?", o:["2 m","50 m","15 m","0,5 m"], a:1, topic:"Mexanika"},
    {q:"Ohm qonuniga ko‘ra, tok kuchi 2 A, qarshilik 5 Ω bo‘lsa, kuchlanish necha volt?", o:["2,5 V","7 V","10 V","25 V"], a:2, topic:"Elektr"},
    {q:"Matematik mayatnikning tebranish davri uzunlikka qanday bog‘liq?", o:["Chiziqli","Teskari proporsional","Kvadrat ildiziga to‘g‘ri proporsional","Bog‘liq emas"], a:2, topic:"Tebranishlar"},
    {q:"Yer sirtida erkin tushish tezlanishi taxminan necha m/s²?", o:["3,0","9,8","98","0,98"], a:1, topic:"Mexanika"}
  ]
};
