// Shared Package Benefits (Fixed for all tools)
const PACKAGES = {
  ar: [
    { title: "FREE", desc: "1 تصميم يومياً" },
    { title: "PRO", desc: "تصميمات غير محدودة + جودة أعلى" },
    { title: "VENDOR", desc: "تحويل المنتجات 3D → 2D" },
    { title: "STUDIO", desc: "رندرات عالية + VR + تصدير" }
  ],
  en: [
    { title: "FREE", desc: "1 Design Daily" },
    { title: "PRO", desc: "Unlimited Designs + High Quality" },
    { title: "VENDOR", desc: "Convert Products 3D → 2D" },
    { title: "STUDIO", desc: "High Render + VR + Export" }
  ]
};

export const TOOLS_CONTENT: any = {
  // 1. AI Room Designer
  "ai-room-designer": {
    ar: {
      title: "أداة تصميم الغرف بالذكاء الاصطناعي",
      desc: "حول صورك إلى تصميم احترافي في ثوانٍ",
      definition: {
        title: "التعريف بالأداة",
        text: "أداة تصميم الغرف بالذكاء الاصطناعي – حول صور غرفتك إلى تصميم داخلي احترافي خلال ثوانٍ. تعتمد هذه الأداة على خوارزميات متقدمة تعمل على تحليل صورتك واكتشاف عناصر الغرفة والأبعاد والإضاءة، ثم تولّد تصميمًا داخليًا كاملاً يعكس الذوق المفضل لديك، سواء مودرن، كلاسيك، فندقي، أو أي نمط آخر. تتيح لك الأداة رؤية قبل/بعد بدقة عالية، مع اقتراح توزيع أثاث مثالي، تحسين الإضاءة، اختيار الألوان، وتطوير منظر الغرفة بشكل شامل."
      },
      features: {
        title: "المميزات الرئيسية",
        list: [
          "تحليل ذكي للصور بدقّة عالية",
          "اقتراح تصميمات داخلية جاهزة حسب النمط",
          "معالجة فورية للصور وتحسين الإضاءة",
          "تصميم قبل/بعد بجودة فائقة",
          "دعم التعديل داخل محرر 2D/3D",
          "توليد تصميم باستخدام الذكاء الاصطناعي في ثوانٍ",
          "حفظ التصميم داخل مشروع المستخدم تلقائيًا",
          "اختيار الأنماط (مودرن – كلاسيك – إسلامي – نيوكلاسيك – فندقي – صناعي …)"
        ]
      },
      howTo: {
        title: "كيف تعمل الأداة؟",
        steps: [
          "ارفع صورة للمساحة الخاصة بك",
          "اختر نمط الديكور الذي ترغب به",
          "انتظر تحليل الذكاء الاصطناعي للصورة",
          "شاهد النتيجة النهائية بتأثير قبل/بعد",
          "عدّل العناصر عبر محرر 2D أو 3D",
          "احفظ التصميم داخل مشروعك"
        ]
      },
      faq: {
        title: "الأسئلة الشائعة",
        list: [
          { q: "هل يمكن تعديل التصميم بعد توليده؟", a: "نعم، يمكنك التعديل على كل عنصر داخل 2D أو 3D." },
          { q: "هل تحتاج الصورة لجودة عالية؟", a: "لا، الأداة تحتوي على نظام لتحسين جودة الصور القديمة." },
          { q: "هل يمكن الاختيار بين أكثر من نمط؟", a: "نعم، يمكنك تجربة جميع الأنماط دون حدود." },
          { q: "هل يتم استخدام منتجات من متجر بيت الريف؟", a: "نعم، لاحقًا سيتم استبدال جميع عناصر الأثاث بمنتجات متجر بيت الريف لعرض الأسعار تلقائيًا." }
        ]
      },
      packages: PACKAGES.ar
    },
    en: {
      title: "AI Room Designer",
      desc: "Turn your photos into professional designs in seconds",
      definition: {
        title: "Tool Definition",
        text: "AI Room Designer – Turn your room photos into professional interior design in seconds. This tool relies on advanced algorithms to analyze your photo, detecting room elements, dimensions, and lighting, then generates a full interior design reflecting your preferred taste, whether Modern, Classic, Luxury, or any other style. The tool allows you to see Before/After in high quality, suggesting optimal furniture layout, lighting enhancement, color selection, and comprehensive room visualization."
      },
      features: {
        title: "Key Features",
        list: [
          "High-precision intelligent image analysis",
          "Ready-made interior design suggestions by style",
          "Instant image processing and lighting enhancement",
          "Superior quality Before/After design",
          "Support editing within 2D/3D editor",
          "AI design generation in seconds",
          "Automatically save design to user project",
          "Style selection (Modern - Classic - Islamic - Neoclassic - Luxury - Industrial...)"
        ]
      },
      howTo: {
        title: "How does it work?",
        steps: [
          "Upload a photo of your space",
          "Choose the decor style you desire",
          "Wait for AI analysis of the image",
          "View the final result with Before/After effect",
          "Edit elements via 2D or 3D editor",
          "Save the design to your project"
        ]
      },
      faq: {
        title: "FAQ",
        list: [
          { q: "Can I edit the design after generation?", a: "Yes, you can edit every element within 2D or 3D." },
          { q: "Does the image need high quality?", a: "No, the tool includes a system to enhance old images." },
          { q: "Can I choose multiple styles?", a: "Yes, you can try all styles without limits." },
          { q: "Are Beit Al Reef products used?", a: "Yes, later all furniture elements will be replaced with store products to show prices automatically." }
        ]
      },
      packages: PACKAGES.en
    }
  },

  // 2. Smart Furniture Layout
  "smart-furniture": {
    ar: {
      title: "أداة مخطط الأثاث الذكي",
      desc: "توزيع ذكي للأثاث وفق مساحة الغرفة",
      definition: {
        title: "التعريف بالأداة",
        text: "أداة مخطط الأثاث الذكي – توزيع ذكي للأثاث وفق مساحة الغرفة. تساعدك هذه الأداة على إنشاء مخطط مثالي لتوزيع الأثاث داخل أي غرفة باستخدام الذكاء الاصطناعي. سواء كان لديك مخطط فارغ أو صورة لمساحتك الحالية، ستقترح الأداة أفضل توزيع ممكن للأثاث مع مراعاة المسافات، الحركة، النوافذ، والأبواب. الأداة مناسبة لغرف النوم، المعيشة، المكاتب، والمطابخ."
      },
      features: {
        title: "المميزات الرئيسية",
        list: [
          "تحليل مساحة الغرفة تلقائيًا",
          "اقتراح توزيع أثاث احترافي",
          "دعم جميع أنواع الغرف (نوم، معيشة، مطبخ...)",
          "توليد مخطط 2D دقيق مع عرض 3D",
          "إمكانية التعديل على المقاسات والأثاث يدوياً",
          "حفظ المخطط وتصديره بجودة عالية",
          "استخدام أثاث بمقاسات حقيقية",
          "مراعاة ممرات الحركة والأبواب والنوافذ"
        ]
      },
      howTo: {
        title: "كيف تعمل الأداة؟",
        steps: [
          "ارفع صورة أو مخطط الغرفة",
          "اختر نوع الغرفة (نوم – معيشة – مكتب – مطبخ)",
          "دع الذكاء الاصطناعي يقترح التوزيع المثالي",
          "عدّل المسافات أو الأثاث حسب رغبتك",
          "احفظ المخطط داخل مشروعك لاستخدامه لاحقاً"
        ]
      },
      faq: {
        title: "الأسئلة الشائعة",
        list: [
          { q: "هل الأداة تدعم الغرف الصغيرة؟", a: "نعم، يتم تعديل التوزيع واختيار قطع أثاث تناسب المساحات الصغيرة بذكاء." },
          { q: "هل يمكن تخصيص المقاسات؟", a: "نعم، يمكن تعديل أبعاد كل قطعة أثاث لتناسب الواقع." },
          { q: "هل يمكن دمج الألوان؟", a: "نعم، الأداة تقترح مواد وألوان مناسبة للأثاث المقترح." },
          { q: "هل يمكنني إضافة أثاثي الخاص؟", a: "قريباً ستتمكن من رفع نماذج 3D الخاصة بك." }
        ]
      },
      packages: PACKAGES.ar
    },
    en: {
      title: "Smart Furniture Layout",
      desc: "Smart furniture arrangement based on room size",
      definition: {
        title: "Tool Definition",
        text: "Smart Furniture Layout – Intelligent furniture arrangement based on room space. This tool helps you create the perfect furniture layout for any room using AI. Whether you have an empty plan or a photo of your current space, the tool suggests the best possible arrangement considering distances, movement, windows, and doors. Suitable for bedrooms, living rooms, offices, and kitchens."
      },
      features: {
        title: "Key Features",
        list: [
          "Automatic room space analysis",
          "Professional furniture layout suggestions",
          "Support for all room types (Bedroom, Living, Kitchen...)",
          "Generate precise 2D plan with 3D view",
          "Ability to edit dimensions and furniture manually",
          "Save and export plan in high quality",
          "Use furniture with real-world dimensions",
          "Consideration of movement paths, doors, and windows"
        ]
      },
      howTo: {
        title: "How does it work?",
        steps: [
          "Upload a photo or room plan",
          "Choose room type (Bedroom - Living - Office - Kitchen)",
          "Let AI suggest the perfect layout",
          "Adjust distances or furniture as desired",
          "Save the plan to your project for later use"
        ]
      },
      faq: {
        title: "FAQ",
        list: [
          { q: "Does it support small rooms?", a: "Yes, the layout smartly adapts to fit small spaces." },
          { q: "Can dimensions be customized?", a: "Yes, dimensions of every furniture piece can be edited." },
          { q: "Can colors be matched?", a: "Yes, the tool suggests suitable materials and colors." },
          { q: "Can I add my own furniture?", a: "Soon you will be able to upload your own 3D models." }
        ]
      },
      packages: PACKAGES.en
    }
  },

  // 3. 3D Room Builder
  "3d-builder": {
    ar: {
      title: "مصمم الغرف ثلاثي الأبعاد",
      desc: "بناء وتصميم غرفتك بالكامل قبل التنفيذ",
      definition: {
        title: "التعريف بالأداة",
        text: "مصمم الغرف ثلاثي الأبعاد – بناء وتصميم غرفتك بالكامل قبل التنفيذ. هذه الأداة تسمح لك ببناء غرفتك من الصفر بدقة عالية باستخدام بيئة 3D تفاعلية. اختر الأبعاد، نوع الجدران، الأرضيات، ثم أضف الأثاث وشاهد غرفتك بشكل واقعي تماماً. يمكنك التجول داخل الغرفة وتجربة خامات مختلفة للأرضيات والجدران."
      },
      features: {
        title: "المميزات الرئيسية",
        list: [
          "بناء الغرفة بدقة عالية عبر محرر 3D متطور",
          "مكتبة ضخمة من المواد والألوان (أرضيات، دهانات، ورق جدران)",
          "إضافة الأثاث وتحريكه وتدويره بسهولة تامة",
          "عرض واقعي للإضاءة والظلال (Real-time Rendering)",
          "قياس المسافات تلقائيًا بين العناصر",
          "التصدير لصور عالية الدقة أو فيديو جولة",
          "إمكانية استيراد مخططات 2D وتحويلها",
          "حفظ المشروع والتعديل عليه في أي وقت"
        ]
      },
      howTo: {
        title: "كيف تعمل الأداة؟",
        steps: [
          "اختر أبعاد الغرفة وارسم الجدران",
          "حدّد نوع كسوة الجدران والأرضيات من المكتبة",
          "أضف الأثاث من الكتالوج وقم بتوزيعه",
          "تحكّم بالإضاءة (ضوء شمس، إنارة صناعية)",
          "شاهد النتيجة وتجول داخل الغرفة",
          "احفظ التصميم أو قم بتصدير الصور"
        ]
      },
      faq: {
        title: "الأسئلة الشائعة",
        list: [
          { q: "هل يمكن إضافة أثاث من الخارج؟", a: "نعم، يمكن استيراد نماذج بصيغة GLB/GLTF." },
          { q: "هل يمكن التصدير بجودة عالية؟", a: "نعم، تدعم الأداة الرندر بدقة تصل إلى 4K." },
          { q: "هل الأداة صعبة الاستخدام؟", a: "لا، تم تصميم الواجهة لتكون سهلة وبديهية للمستخدمين غير المتخصصين." },
          { q: "هل يمكنني تغيير ارتفاع السقف؟", a: "نعم، يمكنك التحكم في ارتفاع الجدران والسقف بالكامل." }
        ]
      },
      packages: PACKAGES.ar
    },
    en: {
      title: "3D Room Builder",
      desc: "Build and design your room completely before execution",
      definition: {
        title: "Tool Definition",
        text: "3D Room Builder – Build and design your room completely before execution. This tool allows you to build your room from scratch with high precision using an interactive 3D environment. Choose dimensions, wall types, floors, then add furniture and view your room realistically. You can walk through the room and test different materials for floors and walls."
      },
      features: {
        title: "Key Features",
        list: [
          "Precise room building via advanced 3D editor",
          "Huge library of materials and colors (floors, paints, wallpaper)",
          "Add, move, and rotate furniture easily",
          "Realistic lighting and shadows (Real-time Rendering)",
          "Automatic distance measurement between elements",
          "Export to high-resolution images or tour video",
          "Ability to import and convert 2D plans",
          "Save project and edit anytime"
        ]
      },
      howTo: {
        title: "How does it work?",
        steps: [
          "Choose room dimensions and draw walls",
          "Select wall and floor cladding from library",
          "Add furniture from catalog and arrange it",
          "Control lighting (Sunlight, Artificial light)",
          "View result and walk through the room",
          "Save design or export images"
        ]
      },
      faq: {
        title: "FAQ",
        list: [
          { q: "Can I add external furniture?", a: "Yes, custom models in GLB/GLTF format can be imported." },
          { q: "Can I export in high quality?", a: "Yes, the tool supports rendering up to 4K resolution." },
          { q: "Is the tool hard to use?", a: "No, the interface is designed to be intuitive for non-experts." },
          { q: "Can I change ceiling height?", a: "Yes, you can fully control wall and ceiling height." }
        ]
      },
      packages: PACKAGES.en
    }
  },

  // 4. 2D Room Planner
  "2d-planner": {
    ar: {
      title: "مخطط الغرف الذكي (Room Planner Pro)",
      desc: "رسم مخططات وحساب كميات الدهانات والأرضيات",
      definition: {
        title: "التعريف بالأداة",
        text: "تعد أداة **Room Planner Pro** من منصة 'بيت الريف' نظاماً هندسياً متطوراً يعمل عبر المتصفح (Web-CAD)، مصمم لتمكين المقاولين والعملاء من رسم مخططات الغرف، وحساب الكميات (دهانات، أرضيات، نعلات)، واستخراج تقارير فنية دقيقة بضغطة زر. النظام يضمن التوافق التام مع اللغة العربية ويوفر واجهة سهلة للمحترفين وغير المختصين."
      },
      features: {
        title: "المميزات والأدوات",
        list: [
          "✍️ أدوات رسم ذكية: رسم جدران بخطوط مستقيمة، إضافة أبواب ونوافذ بخصم تلقائي للمساحات",
          "📊 نظام تقارير متطور: واجهات الجدران (Elevations) وجداول الكميات في ملف واحد",
          "🎨 حساب التشطيبات: حساب دقيق لمساحات الدهان، الأرضيات، وأمتار النعلات (Skirting)",
          "📐 تعديل مرن: تحريك الجدران، تغيير المقاسات، وتعديل أماكن الفتحات بالسحب والإفلات",
          "📄 تصدير PDF احترافي: تقارير فنية جاهزة للتنفيذ والمشاركة عبر واتساب",
          "🔄 واجهة ثنائية اللغة: التبديل الفوري بين العربية والإنجليزية للواجهة والتقارير",
          "💾 حفظ تلقائي وآمن: لا فقدان للبيانات، مع إمكانية التعديل في أي وقت"
        ]
      },
      howTo: {
        title: "كيفية استخراج التقرير الفني",
        steps: [
          "ارسم الغرفة باستخدام أداة (Draw Wall) وأضف الفتحات",
          "اضغط على أيقونة 'الملف' (📄) في الشريط العلوي",
          "أدخل اسم العميل والمقاول في الخانات المخصصة",
          "اختر نوع التقرير (عام، دهانات، أو أرضيات) لفلترة البيانات",
          "راجع الواجهات وجدول الكميات في المعاينة المباشرة",
          "اضغط 'حفظ الملف (PDF)' لتحميل التقرير جاهزاً للطباعة"
        ]
      },
      faq: {
        title: "الأسئلة الشائعة",
        list: [
          { q: "هل يتم خصم مساحة النوافذ من الدهان؟", a: "نعم، يتم حساب الصافي تلقائياً بخصم مساحات الأبواب والنوافذ." },
          { q: "ماذا يشمل التقرير؟", a: "يشمل المسقط الأفقي، واجهات الجدران الأربعة، وجداول الكميات." },
          { q: "هل يمكن تشغيل الأداة على الجوال؟", a: "نعم، الأداة تدعم اللمس (Touch) والعمل على جميع الأجهزة." },
          { q: "هل التقارير معتمدة؟", a: "التقارير دقيقة هندسياً ولكن يفضل دائماً المطابقة الميدانية قبل الشراء." }
        ]
      },
      packages: PACKAGES.ar
    },
    en: {
      title: "2D Room Planner",
      desc: "Precise and professional floor planning",
      definition: {
        title: "Tool Definition",
        text: "2D Room Planner – A precise engineering planning tool that allows you to draw walls, doors, and windows with real dimensions. Ideal for engineers, designers, and homeowners who want to plan their spaces before execution. The tool provides accurate measurement tools and a comprehensive architectural symbol library to create clear working drawings."
      },
      features: {
        title: "Key Features",
        list: [
          "Draw walls and partitions with precise dimensions (cm)",
          "Comprehensive library of doors, windows, and openings",
          "Add furniture, electrical, and plumbing symbols (2D)",
          "Automatic area and perimeter calculation for each room",
          "Export plan as PDF or CAD (DXF)",
          "Easy Drag & Drop interface",
          "Ability to print plan to specific scale",
          "Convert plan to 3D with one click"
        ]
      },
      howTo: {
        title: "How does it work?",
        steps: [
          "Start by drawing exterior and interior walls",
          "Place doors and windows accurately",
          "Add furniture symbols to show layout",
          "Use measurement tools to verify dimensions",
          "Add text notes and dimensions",
          "Export final file or print it"
        ]
      },
      faq: {
        title: "FAQ",
        list: [
          { q: "Is the plan engineeringly accurate?", a: "Yes, the tool relies on 100% real and accurate dimensions." },
          { q: "Can I export AutoCAD files?", a: "Yes, the tool supports exporting DXF files compatible with AutoCAD." },
          { q: "Can it calculate room area?", a: "Yes, total area for each room is calculated automatically." },
          { q: "Does it support multiple floors?", a: "Yes, you can create plans for multiple floors within the same project." }
        ]
      },
      packages: PACKAGES.en
    }
  },

  // 5. Material Tester
  "material-tester": {
    ar: {
      title: "أداة تجربة المواد والألوان",
      desc: "اختبار الخامات والدهانات على مساحتك",
      definition: {
        title: "التعريف بالأداة",
        text: "أداة تجربة المواد والألوان – تتيح لك هذه الأداة تجربة مئات الخامات والألوان على صور غرفتك الحقيقية. هل تشعر بالحيرة في اختيار لون الدهان أو نوع الأرضية؟ فقط ارفع صورة غرفتك، وحدد الجدار أو الأرضية، ثم جرب تغيير الخامات (باركيه، سيراميك، رخام، دهان، ورق جدران) بلمسة واحدة وشاهد النتيجة بواقعية مذهلة."
      },
      features: {
        title: "المميزات الرئيسية",
        list: [
          "مكتبة ضخمة تضم +1000 خامة ولون حقيقي",
          "تقنية الذكاء الاصطناعي للتعرف على الأسطح (جدران، أرضيات)",
          "تجربة مواد حقيقية متوفرة في السوق",
          "مقارنة بين خيارين (Split View) لاتخاذ القرار",
          "إمكانية تعديل الإضاءة والظلال لتتناسب مع الخامة",
          "دعم جميع أنواع الأسطح (خشب، قماش، سيراميك، معدن)",
          "حفظ التنسيقات المفضلة في لوحة أفكار (Moodboard)",
          "الحصول على أكواد الألوان وأسماء المواد المستخدمة"
        ]
      },
      howTo: {
        title: "كيف تعمل الأداة؟",
        steps: [
          "ارفع صورة واضحة للغرفة",
          "اختر السطح المراد تغييره (مثلاً: الأرضية)",
          "تصفح مكتبة المواد واختر الخامة المناسبة",
          "شاهد التطبيق الفوري للخامة على الصورة",
          "جرب خامات مختلفة وقارن بين النتائج",
          "احفظ الصورة النهائية مع تفاصيل المواد"
        ]
      },
      faq: {
        title: "الأسئلة الشائعة",
        list: [
          { q: "هل المواد المستخدمة حقيقية؟", a: "نعم، جميع الخامات مأخوذة من كتالوجات موردين حقيقيين." },
          { q: "هل تعمل الأداة على الأثاث أيضاً؟", a: "نعم، يمكنك تغيير قماش الكنب أو لون الخشب." },
          { q: "كيف أحصل على اسم اللون؟", a: "يظهر كود اللون واسم المورد أسفل الصورة بعد التطبيق." },
          { q: "هل تحتاج الصورة لإضاءة جيدة؟", a: "يفضل ذلك للحصول على أفضل نتيجة واقعية للخامات." }
        ]
      },
      packages: PACKAGES.ar
    },
    en: {
      title: "Material & Color Tester",
      desc: "Test materials and paints on your space",
      definition: {
        title: "Tool Definition",
        text: "Material & Color Tester – This tool allows you to test hundreds of materials and colors on your real room photos. Confused about paint color or flooring type? Just upload your room photo, select the wall or floor, then try changing materials (parquet, ceramic, marble, paint, wallpaper) with a single touch and see the result with stunning realism."
      },
      features: {
        title: "Key Features",
        list: [
          "Huge library containing +1000 real materials and colors",
          "AI technology to recognize surfaces (walls, floors)",
          "Test real materials available in the market",
          "Compare two options (Split View) to decide",
          "Adjust lighting and shadows to match material",
          "Support all surface types (wood, fabric, ceramic, metal)",
          "Save favorites to a Moodboard",
          "Get color codes and material names used"
        ]
      },
      howTo: {
        title: "How does it work?",
        steps: [
          "Upload a clear photo of the room",
          "Select the surface to change (e.g., Floor)",
          "Browse material library and select suitable material",
          "View instant application of material on photo",
          "Try different materials and compare results",
          "Save final image with material details"
        ]
      },
      faq: {
        title: "FAQ",
        list: [
          { q: "Are the materials used real?", a: "Yes, all materials are from real supplier catalogs." },
          { q: "Does it work on furniture too?", a: "Yes, you can change sofa fabric or wood color." },
          { q: "How do I get the color name?", a: "Color code and supplier name appear below image after application." },
          { q: "Does photo need good lighting?", a: "Preferably yes, to get the most realistic material result." }
        ]
      },
      packages: PACKAGES.en
    }
  },

  // 6. 2D to 3D Converter
  "2d-to-3d": {
    ar: {
      title: "تحويل المخطط 2D إلى 3D",
      desc: "تحويل تلقائي فوري للمخططات الهندسية",
      definition: {
        title: "التعريف بالأداة",
        text: "أداة التحويل الفوري 2D إلى 3D – لا داعي لإعادة رسم المخططات يدوياً. تقوم هذه الأداة بقراءة ملفات الأوتوكاد (DXF/DWG) أو صور المخططات (JPG/PDF)، وبناء نموذج ثلاثي الأبعاد (3D Model) للجدران والأبواب والنوافذ تلقائياً في ثوانٍ معدودة باستخدام الذكاء الاصطناعي."
      },
      features: {
        title: "المميزات الرئيسية",
        list: [
          "تحويل فوري للمخططات الورقية أو الرقمية إلى 3D",
          "التعرف التلقائي على سماكة الجدران والفتحات",
          "رفع الجدران بارتفاعات قياسية قابلة للتعديل",
          "توفير ساعات من العمل اليدوي في النمذجة (Modeling)",
          "توافق مع ملفات PDF, JPG, PNG, DXF",
          "إمكانية تصدير الموديل الناتج إلى 3D Max أو SketchUp",
          "دقة عالية في تفسير الخطوط المعمارية",
          "واجهة بسيطة: ارفع المخطط واحصل على الـ 3D"
        ]
      },
      howTo: {
        title: "كيف تعمل الأداة؟",
        steps: [
          "ارفع صورة المخطط أو ملف الـ CAD",
          "حدد مقياس الرسم (Scale) بقطعة مرجعية",
          "اضغط على زر 'تحويل إلى 3D'",
          "راجع النموذج الناتج وعدّل الارتفاعات إذا لزم",
          "أضف الأثاث أو الخامات إذا رغبت",
          "قم بتصدير الملف بصيغة OBJ أو GLB"
        ]
      },
      faq: {
        title: "الأسئلة الشائعة",
        list: [
          { q: "هل تعمل الأداة مع المخططات اليدوية (سكتش)؟", a: "نعم، بشرط أن تكون الخطوط واضحة ومغلقة." },
          { q: "ما هي الصيغ المدعومة للتصدير؟", a: "تدعم التصدير بصيغ OBJ, GLB, STL المتوافقة مع برامج التصميم." },
          { q: "هل يتم التعرف على الأبواب تلقائياً؟", a: "نعم، الذكاء الاصطناعي يميز رموز الأبواب ويفرغ مكانها في الجدار." },
          { q: "كم تستغرق عملية التحويل؟", a: "تتم العملية عادة في أقل من 30 ثانية." }
        ]
      },
      packages: PACKAGES.ar
    },
    en: {
      title: "2D to 3D Auto Converter",
      desc: "Instant automatic conversion of floor plans",
      definition: {
        title: "Tool Definition",
        text: "Instant 2D to 3D Converter – No need to redraw plans manually. This tool reads AutoCAD files (DXF/DWG) or plan images (JPG/PDF), and automatically builds a 3D model of walls, doors, and windows in mere seconds using Artificial Intelligence."
      },
      features: {
        title: "Key Features",
        list: [
          "Instant conversion of paper or digital plans to 3D",
          "Automatic recognition of wall thickness and openings",
          "Extrude walls to standard adjustable heights",
          "Save hours of manual modeling work",
          "Compatible with PDF, JPG, PNG, DXF",
          "Ability to export model to 3D Max or SketchUp",
          "High accuracy in interpreting architectural lines",
          "Simple interface: Upload plan, get 3D"
        ]
      },
      howTo: {
        title: "How does it work?",
        steps: [
          "Upload plan image or CAD file",
          "Set the scale using a reference segment",
          "Click 'Convert to 3D' button",
          "Review generated model and adjust heights if needed",
          "Add furniture or materials if desired",
          "Export file in OBJ or GLB format"
        ]
      },
      faq: {
        title: "FAQ",
        list: [
          { q: "Does it work with hand sketches?", a: "Yes, provided the lines are clear and closed." },
          { q: "What export formats are supported?", a: "Supports OBJ, GLB, STL compatible with design software." },
          { q: "Are doors recognized automatically?", a: "Yes, AI identifies door symbols and creates openings." },
          { q: "How long does conversion take?", a: "Process usually takes less than 30 seconds." }
        ]
      },
      packages: PACKAGES.en
    }
  },

  // 7. Style Detector
  "style-detector": {
    ar: {
      title: "كشف نمط التصميم",
      desc: "معرفة نمط الديكور من صورة بالذكاء الاصطناعي",
      definition: {
        title: "التعريف بالأداة",
        text: "أداة كشف نمط التصميم – هل أعجبتك صورة ديكور ولا تعرف اسم النمط؟ هذه الأداة هي دليلك الفني. قم برفع أي صورة لتصميم داخلي، وسيقوم الذكاء الاصطناعي بتحليل عناصرها (الأثاث، الألوان، الزخارف) وإخبارك باسم النمط بدقة (مثلاً: بوهيمي، اسكندنافي، آرت ديكو) مع شرح لأهم خصائصه واقتراح منتجات مشابهة."
      },
      features: {
        title: "المميزات الرئيسية",
        list: [
          "تحليل الصور والتعرف على +50 نمط ديكور عالمي",
          "شرح تفصيلي لخصائص النمط المكتشف",
          "اقتراح لوحة ألوان (Color Palette) مستخرجة من الصورة",
          "تحديد العناصر المميزة في التصميم (مثل نوع السجاد، الإضاءة)",
          "اقتراح صور مشابهة من مكتبة التصاميم للإلهام",
          "ربط النمط بمنتجات متوفرة للشراء",
          "دقة عالية في التمييز بين الأنماط المتشابهة",
          "إمكانية حفظ النتيجة في ملفك الشخصي"
        ]
      },
      howTo: {
        title: "كيف تعمل الأداة؟",
        steps: [
          "ارفع صورة التصميم التي تريد معرفة نمطها",
          "انتظر لحظات ليقوم النظام بتحليل الصورة",
          "اقرأ التقرير: اسم النمط، الألوان، والعناصر",
          "تصفح الصور المشابهة والمنتجات المقترحة",
          "احفظ لوحة الألوان لاستخدامها في مشروعك",
          "شارك النتيجة مع مصممك أو أصدقائك"
        ]
      },
      faq: {
        title: "الأسئلة الشائعة",
        list: [
          { q: "ما هي دقة التعرف على النمط؟", a: "الدقة تتجاوز 95% بفضل قاعدة بيانات ضخمة من التصاميم." },
          { q: "هل يمكن تحليل صور من Pinterest؟", a: "نعم، يمكنك رفع أي صورة محفوظة من الإنترنت." },
          { q: "هل تشرح الأداة كيفية تطبيق النمط؟", a: "نعم، تقدم نصائح عملية لتطبيق النمط في منزلك." },
          { q: "كم عدد الأنماط التي تعرفها الأداة؟", a: "أكثر من 50 نمط تشمل الكلاسيكي، المودرن، والريفي." }
        ]
      },
      packages: PACKAGES.ar
    },
    en: {
      title: "AI Style Detector",
      desc: "Identify decor style from photo",
      definition: {
        title: "Tool Definition",
        text: "AI Style Detector – Liked a decor photo but don't know the style name? This tool is your artistic guide. Upload any interior design photo, and AI will analyze its elements (furniture, colors, ornaments) and tell you the style name accurately (e.g., Bohemian, Scandinavian, Art Deco) with an explanation of its key characteristics and similar product suggestions."
      },
      features: {
        title: "Key Features",
        list: [
          "Analyze photos and recognize +50 global decor styles",
          "Detailed explanation of discovered style characteristics",
          "Suggest Color Palette extracted from image",
          "Identify distinct elements (carpet type, lighting)",
          "Suggest similar photos for inspiration",
          "Link style to available purchasable products",
          "High accuracy in distinguishing similar styles",
          "Save result to your profile"
        ]
      },
      howTo: {
        title: "How does it work?",
        steps: [
          "Upload the design photo you want to identify",
          "Wait moments for system to analyze image",
          "Read report: Style name, colors, and elements",
          "Browse similar photos and suggested products",
          "Save color palette for your project",
          "Share result with your designer or friends"
        ]
      },
      faq: {
        title: "FAQ",
        list: [
          { q: "How accurate is the recognition?", a: "Accuracy exceeds 95% thanks to huge design database." },
          { q: "Can I analyze Pinterest photos?", a: "Yes, you can upload any image saved from the internet." },
          { q: "Does it explain how to apply the style?", a: "Yes, it offers practical tips to apply style in your home." },
          { q: "How many styles does it know?", a: "Over 50 styles including Classic, Modern, and Rustic." }
        ]
      },
      packages: PACKAGES.en
    }
  },

  // 8. Photo Measurements
  "photo-measure": {
    ar: {
      title: "أداة قياسات الصور",
      desc: "استخراج المقاسات من الصور بالذكاء الاصطناعي",
      definition: {
        title: "التعريف بالأداة",
        text: "أداة قياسات الصور (AI Measurement) – وداعاً لشريط القياس التقليدي. تتيح لك هذه الأداة استخراج مقاسات تقريبية للغرفة أو النوافذ أو الأثاث مباشرة من خلال صورة واحدة. فقط ضع 'عنصر مرجعي' (مثل ورقة A4 أو بطاقة) في الصورة، وسيقوم الذكاء الاصطناعي بحساب باقي الأبعاد في الصورة بناءً عليه."
      },
      features: {
        title: "المميزات الرئيسية",
        list: [
          "استخراج الأبعاد (الطول والعرض) من الصور مباشرة",
          "لا حاجة لأجهزة قياس ليزر أو أدوات معقدة",
          "دقة مقبولة لأغراض التخطيط الأولي والتقدير",
          "إمكانية قياس النوافذ لحساب الستائر",
          "إمكانية قياس مساحة الجدار لحساب الدهان",
          "تصدير الصورة مع الأبعاد المسجلة عليها",
          "دعم تقنية الواقع المعزز (AR) لقياس مباشر بالكاميرا",
          "واجهة سهلة: التقط صورة، حدد النقاط، احصل على المقاس"
        ]
      },
      howTo: {
        title: "كيف تعمل الأداة؟",
        steps: [
          "ضع جسماً معروف القياس (بطاقة بنكية / ورقة A4) في المشهد",
          "التقط صورة واضحة للواجهة أو الجدار",
          "حدد الجسم المرجعي في الصورة لضبط المقياس",
          "ارسم خطوطاً على الحواف التي تريد قياسها",
          "ستظهر المقاسات فوراً على الخطوط",
          "احفظ الصورة كمرجع للمقاسات"
        ]
      },
      faq: {
        title: "الأسئلة الشائعة",
        list: [
          { q: "ما مدى دقة القياس؟", a: "الدقة تصل إلى 95-98% عند اتباع التعليمات واستخدام مرجع صحيح." },
          { q: "هل تغني عن المخطط الهندسي؟", a: "تصلح للتقديرات الأولية وشراء الأثاث، ولا تغني عن المخطط التنفيذي." },
          { q: "ما هو أفضل جسم مرجعي؟", a: "ورقة A4 بيضاء قياسية هي الأفضل لسهولة التعرف عليها." },
          { q: "هل تعمل على الصور البانورامية؟", a: "يفضل الصور المسطحة (Flat) للحصول على أدق نتيجة." }
        ]
      },
      packages: PACKAGES.ar
    },
    en: {
      title: "Photo Measurement AI",
      desc: "Extract dimensions from photos using AI",
      definition: {
        title: "Tool Definition",
        text: "Photo Measurement AI – Goodbye tape measure. This tool allows you to extract approximate dimensions of rooms, windows, or furniture directly from a single photo. Just place a 'reference object' (like A4 paper or card) in the photo, and AI will calculate the rest of the dimensions based on it."
      },
      features: {
        title: "Key Features",
        list: [
          "Extract dimensions (Length/Width) directly from photos",
          "No need for laser meters or complex tools",
          "Acceptable accuracy for initial planning and estimation",
          "Measure windows for curtain calculation",
          "Measure wall area for paint calculation",
          "Export image with recorded dimensions",
          "Supports AR for direct camera measurement",
          "Easy interface: Snap photo, mark points, get size"
        ]
      },
      howTo: {
        title: "How does it work?",
        steps: [
          "Place a known object (Credit card / A4 paper) in scene",
          "Take a clear photo of the elevation or wall",
          "Mark the reference object to calibrate scale",
          "Draw lines on edges you want to measure",
          "Measurements appear instantly on lines",
          "Save image as dimension reference"
        ]
      },
      faq: {
        title: "FAQ",
        list: [
          { q: "How accurate is the measurement?", a: "Accuracy up to 95-98% when following instructions and using correct reference." },
          { q: "Does it replace engineering plans?", a: "Good for estimates and buying furniture, not for construction drawings." },
          { q: "What is the best reference object?", a: "Standard white A4 paper is best for easy recognition." },
          { q: "Does it work on panoramic photos?", a: "Flat photos are preferred for most accurate result." }
        ]
      },
      packages: PACKAGES.en
    }
  },

  // 9. Vendor 3D
  "vendor-3d": {
    ar: {
      title: "إنشاء منتجات 3D للمزوّدين",
      desc: "حول صور منتجاتك إلى مجسمات 3D تفاعلية",
      definition: {
        title: "التعريف بالأداة",
        text: "أداة Vendor 3D Product Builder – مخصصة لأصحاب متاجر الأثاث والديكور. تمكنك هذه الأداة من تحويل صور منتجاتك (كنب، طاولات، إضاءة) إلى نماذج ثلاثية الأبعاد (3D Models) وتفاعلية (AR) لعرضها في متجرك. ساعد عملاءك على تخيل المنتج في منازلهم قبل الشراء وزد مبيعاتك بتقنية الواقع المعزز."
      },
      features: {
        title: "المميزات الرئيسية",
        list: [
          "تحويل صور المنتج (من عدة زوايا) إلى موديل 3D",
          "عرض المنتج بتقنية 360 درجة",
          "دعم تقنية الواقع المعزز (AR) لتجربة المنتج في الغرفة",
          "توليد كود (Embed Code) لإضافة العارض في موقعك",
          "تحسين جودة التكسشر (Texture) والألوان تلقائياً",
          "ضغط حجم الملف لسرعة التحميل على الويب",
          "تصدير بصيغ GLB/USDZ المتوافقة مع أبل وأندرويد",
          "زيادة معدل التحويل وتقليل نسبة المرتجعات"
        ]
      },
      howTo: {
        title: "كيف تعمل الأداة؟",
        steps: [
          "التقط 5-10 صور للمنتج من زوايا مختلفة",
          "ارفع الصور إلى منصة المعالجة",
          "يقوم النظام ببناء المجسم ثلاثي الأبعاد",
          "راجع الموديل وقم بضبط الخامات إذا لزم",
          "احصل على رابط المشاهدة وكود التضمين",
          "انشر المنتج في متجرك الإلكتروني"
        ]
      },
      faq: {
        title: "الأسئلة الشائعة",
        list: [
          { q: "كم صورة أحتاج للمنتج الواحد؟", a: "يفضل من 8 إلى 12 صورة تغطي جميع الجوانب." },
          { q: "هل تحتاج لخلفية بيضاء؟", a: "ليس ضرورياً، فالذكاء الاصطناعي يعزل الخلفية تلقائياً." },
          { q: "هل يمكنني استخدام الهاتف للتصوير؟", a: "نعم، كاميرا الهاتف الحديثة كافية جداً." },
          { q: "ما تكلفة تحويل المنتج؟", a: "مشمولة في باقة VENDOR، أو بنظام الدفع لكل قطعة." }
        ]
      },
      packages: PACKAGES.ar
    },
    en: {
      title: "Vendor 3D Product Builder",
      desc: "Turn product photos into interactive 3D models",
      definition: {
        title: "Tool Definition",
        text: "Vendor 3D Product Builder – Designed for furniture and decor store owners. This tool enables you to convert your product photos (sofas, tables, lighting) into 3D Models and interactive AR experiences for your store. Help customers visualize products in their homes before buying and boost sales with Augmented Reality."
      },
      features: {
        title: "Key Features",
        list: [
          "Convert product photos (multi-angle) to 3D model",
          "360-degree product view",
          "Support Augmented Reality (AR) to try product in room",
          "Generate Embed Code to add viewer to your site",
          "Auto-enhance texture quality and colors",
          "Compress file size for fast web loading",
          "Export GLB/USDZ compatible with Apple & Android",
          "Increase conversion rate and reduce returns"
        ]
      },
      howTo: {
        title: "How does it work?",
        steps: [
          "Take 5-10 photos of product from different angles",
          "Upload photos to processing platform",
          "System builds the 3D object",
          "Review model and adjust materials if needed",
          "Get view link and embed code",
          "Publish product to your e-store"
        ]
      },
      faq: {
        title: "FAQ",
        list: [
          { q: "How many photos per product?", a: "Preferably 8 to 12 photos covering all sides." },
          { q: "Do I need white background?", a: "Not necessary, AI automatically isolates background." },
          { q: "Can I use phone camera?", a: "Yes, modern phone cameras are sufficient." },
          { q: "Cost per conversion?", a: "Included in VENDOR package, or pay-per-item." }
        ]
      },
      packages: PACKAGES.en
    }
  },

  // 10. VR Walkthrough
  "vr-walkthrough": {
    ar: {
      title: "جولة افتراضية VR",
      desc: "تجربة التصميم بالواقع الافتراضي",
      definition: {
        title: "التعريف بالأداة",
        text: "أداة الجولة الافتراضية (VR Walkthrough) – انقل عميلك إلى داخل التصميم قبل وضع حجر واحد. تحول هذه الأداة تصميماتك الـ 3D إلى تجربة واقع افتراضي غامرة. يمكن للمستخدم ارتداء نظارة VR (أو استخدام الهاتف) والمشي داخل الغرف، فتح الأبواب، وتغيير الألوان بشكل تفاعلي، مما يعطي شعوراً حقيقياً بالمساحة والأبعاد."
      },
      features: {
        title: "المميزات الرئيسية",
        list: [
          "تحويل مشاريع 3D إلى تجربة VR بنقرة واحدة",
          "دعم نظارات Meta Quest, Google Cardboard",
          "وضع المشاهدة عبر المتصفح (WebVR) بدون نظارة",
          "نقاط تنقل (Hotspots) للانتقال بين الغرف",
          "تفاعل مباشر: تغيير خامات الأرضيات أثناء الجولة",
          "جودة صورة عالية وواقعية",
          "إمكانية مشاركة رابط الجولة مع العميل",
          "إضافة أصوات محيطية لتعزيز التجربة"
        ]
      },
      howTo: {
        title: "كيف تعمل الأداة؟",
        steps: [
          "أكمل تصميم الغرفة في أداة 3D Builder",
          "اختر 'تصدير إلى VR' من القائمة",
          "سيتم معالجة المشهد وتوليد رابط الجولة",
          "افتح الرابط على الهاتف أو نظارة VR",
          "استمتع بالتجول داخل تصميمك",
          "شارك الرابط مع الآخرين"
        ]
      },
      faq: {
        title: "الأسئلة الشائعة",
        list: [
          { q: "هل أحتاج نظارة VR باهظة؟", a: "لا، تعمل حتى مع النظارات الكرتونية البسيطة والهواتف." },
          { q: "هل يمكن للعميل التجول بحرية؟", a: "نعم، يمكنه النظر في كل الاتجاهات والانتقال بين النقاط." },
          { q: "هل الملف ثقيل التحميل؟", a: "يتم تحسينه ليعمل بسلاسة عبر الإنترنت (Cloud Streaming)." },
          { q: "هل يمكن تسجيل فيديو للجولة؟", a: "نعم، يمكنك تسجيل مسار الجولة وحفظه كفيديو." }
        ]
      },
      packages: PACKAGES.ar
    },
    en: {
      title: "VR Walkthrough",
      desc: "Virtual Reality Design Experience",
      definition: {
        title: "Tool Definition",
        text: "VR Walkthrough Tool – Transport your client inside the design before laying a single brick. This tool converts your 3D designs into an immersive Virtual Reality experience. Users can wear a VR headset (or use phone) and walk inside rooms, open doors, and interactively change colors, giving a real sense of space and scale."
      },
      features: {
        title: "Key Features",
        list: [
          "Convert 3D projects to VR experience in one click",
          "Support Meta Quest, Google Cardboard",
          "Browser viewing mode (WebVR) without headset",
          "Hotspots for navigation between rooms",
          "Live interaction: Change floor materials during tour",
          "High realistic image quality",
          "Share tour link with client",
          "Add ambient sounds to enhance experience"
        ]
      },
      howTo: {
        title: "How does it work?",
        steps: [
          "Complete room design in 3D Builder tool",
          "Select 'Export to VR' from menu",
          "Scene will be processed and tour link generated",
          "Open link on phone or VR headset",
          "Enjoy walking through your design",
          "Share link with others"
        ]
      },
      faq: {
        title: "FAQ",
        list: [
          { q: "Do I need expensive VR glasses?", a: "No, works even with simple cardboard viewers and phones." },
          { q: "Can client walk freely?", a: "Yes, they can look in all directions and move between points." },
          { q: "Is file heavy to load?", a: "It is optimized for smooth Cloud Streaming." },
          { q: "Can I record tour video?", a: "Yes, you can record the tour path and save as video." }
        ]
      },
      packages: PACKAGES.en
    }
  },

  // 11. Store Integration
  "store-integration": {
    ar: {
      title: "مكتبة الأثاث والمواد",
      desc: "ربط التصميم بمنتجات حقيقية من المتجر",
      definition: {
        title: "التعريف بالأداة",
        text: "مكتبة الأثاث والمواد (Store Integration) – الجسر بين التصميم والتنفيذ. تتيح لك هذه الأداة الوصول إلى كتالوج كامل من المنتجات الحقيقية المتوفرة في متجر بيت الريف (أثاث، إضاءة، مواد بناء). عند استخدام هذه المنتجات في تصميمك، ستحصل تلقائياً على قائمة مشتريات جاهزة مع الأسعار الإجمالية، مما يحول التصميم الخيالي إلى مشروع قابل للتنفيذ فوراً."
      },
      features: {
        title: "المميزات الرئيسية",
        list: [
          "كتالوج يضم آلاف المنتجات الحقيقية مع الأسعار",
          "تحديث تلقائي للمخزون والأسعار",
          "سحب وإفلات المنتجات داخل التصميم 3D",
          "حساب التكلفة التقديرية للغرفة بالكامل",
          "إمكانية الشراء المباشر بنقرة واحدة",
          "معلومات تفصيلية لكل منتج (المقاس، الخامة، الضمان)",
          "تصفية المنتجات حسب الستايل والسعر",
          "بدائل مقترحة للمنتجات غير المتوفرة"
        ]
      },
      howTo: {
        title: "كيف تعمل الأداة؟",
        steps: [
          "افتح مكتبة المتجر داخل المحرر",
          "ابحث عن المنتج (مثلاً: صوفا مودرن رمادي)",
          "اسحب المنتج وضعه في مساحتك",
          "سيتم إضافة المنتج لقائمة التسعير تلقائياً",
          "أكمل تأثيث الغرفة",
          "اضغط 'شراء الكل' لإتمام الطلب"
        ]
      },
      faq: {
        title: "الأسئلة الشائعة",
        list: [
          { q: "هل الأسعار شاملة الضريبة؟", a: "نعم، الأسعار المعروضة نهائية وشاملة." },
          { q: "ماذا لو تغير السعر بعد التصميم؟", a: "يتم تحديث الأسعار في سلة المشتريات عند الدفع." },
          { q: "هل يمكن طلب منتجات مخصصة؟", a: "نعم، يوجد قسم للطلبات الخاصة والتفصيل." },
          { q: "هل التوصيل متاح؟", a: "نعم، يتم توصيل جميع منتجات المتجر لكافة المناطق." }
        ]
      },
      packages: PACKAGES.ar
    },
    en: {
      title: "Store Integration Library",
      desc: "Link design to real store products",
      definition: {
        title: "Tool Definition",
        text: "Store Integration Library – The bridge between design and execution. This tool gives you access to a full catalog of real products available in Beit Al Reef store (furniture, lighting, building materials). When using these products in your design, you automatically get a ready shopping list with total prices, turning a fantasy design into an instantly executable project."
      },
      features: {
        title: "Key Features",
        list: [
          "Catalog with thousands of real products with prices",
          "Automatic update of stock and prices",
          "Drag & drop products into 3D design",
          "Calculate estimated cost for entire room",
          "Direct one-click purchase",
          "Detailed info per product (Size, Material, Warranty)",
          "Filter products by style and price",
          "Suggested alternatives for out-of-stock items"
        ]
      },
      howTo: {
        title: "How does it work?",
        steps: [
          "Open store library inside editor",
          "Search for product (e.g., Grey Modern Sofa)",
          "Drag product and place in your space",
          "Product is added to pricing list automatically",
          "Complete furnishing the room",
          "Click 'Buy All' to complete order"
        ]
      },
      faq: {
        title: "FAQ",
        list: [
          { q: "Are prices tax inclusive?", a: "Yes, displayed prices are final and inclusive." },
          { q: "What if price changes after design?", a: "Prices update in cart at checkout." },
          { q: "Can I order custom products?", a: "Yes, there is a section for custom orders." },
          { q: "Is delivery available?", a: "Yes, all store products are delivered to all regions." }
        ]
      },
      packages: PACKAGES.en
    }
  },

  // 12. Save / Export
  "save-export": {
    ar: {
      title: "حفظ / مشاركة / تصدير",
      desc: "تصدير المخططات والملفات بجودة احترافية",
      definition: {
        title: "التعريف بالأداة",
        text: "أداة الحفظ والتصدير (Save & Export) – هي مركز إدارة مخرجات مشروعك. بعد الانتهاء من التصميم، تتيح لك هذه الأداة حزمة متكاملة من خيارات التصدير لتناسب جميع الاحتياجات: سواء كنت تريد صورة عالية الدقة للمشاركة على انستجرام، أو مخطط PDF للتنفيذ، أو ملف CAD للمهندس، أو حتى رابط تفاعلي للعميل."
      },
      features: {
        title: "المميزات الرئيسية",
        list: [
          "تصدير صور رندر (Rendering) بدقة تصل لـ 8K",
          "تصدير مخططات تنفيذية بصيغة PDF مع الأبعاد",
          "تصدير ملفات CAD (DXF/DWG) للمهندسين",
          "إنشاء رابط مشاهدة للمشروع (View-only Link)",
          "تصدير قائمة المشتريات والكميات (Excel/PDF)",
          "حفظ نسخ متعددة من التصميم (Versions)",
          "مشاركة مباشرة عبر واتساب أو البريد الإلكتروني",
          "التخزين السحابي الآمن لجميع مشاريعك"
        ]
      },
      howTo: {
        title: "كيف تعمل الأداة؟",
        steps: [
          "انتقل إلى قائمة 'تصدير' في شريط الأدوات",
          "اختر نوع الملف المطلوب (صورة، مخطط، ملف هندسي)",
          "حدد الجودة والإعدادات المطلوبة",
          "اضغط 'تنزيل' لحفظ الملف على جهازك",
          "أو اختر 'مشاركة' لإرسال الرابط مباشرة",
          "يمكنك العودة وتصدير صيغ أخرى في أي وقت"
        ]
      },
      faq: {
        title: "الأسئلة الشائعة",
        list: [
          { q: "هل يوجد علامة مائية على الصور؟", a: "في الباقة المجانية نعم، وتزال في باقات PRO و STUDIO." },
          { q: "كم مدة حفظ الملفات في الموقع؟", a: "تحفظ للأبد طالما حسابك نشط." },
          { q: "هل يمكنني فتح الملف في برامج أخرى؟", a: "نعم، صيغ DXF و OBJ متوافقة مع معظم برامج التصميم." },
          { q: "هل يمكن طباعة المخططات بمقياس رسم؟", a: "نعم، ملفات PDF تدعم الطباعة بمقاييس رسم هندسية." }
        ]
      },
      packages: PACKAGES.ar
    },
    en: {
      title: "Save / Share / Export",
      desc: "Export plans and files in professional quality",
      definition: {
        title: "Tool Definition",
        text: "Save & Export Tool – The output management hub for your project. After finishing design, this tool offers a complete suite of export options for all needs: whether you want high-res image for Instagram, PDF plan for execution, CAD file for engineer, or interactive link for client."
      },
      features: {
        title: "Key Features",
        list: [
          "Export render images up to 8K resolution",
          "Export execution plans as PDF with dimensions",
          "Export CAD files (DXF/DWG) for engineers",
          "Create view-only project link",
          "Export shopping list and quantities (Excel/PDF)",
          "Save multiple design versions",
          "Direct share via WhatsApp or Email",
          "Secure cloud storage for all your projects"
        ]
      },
      howTo: {
        title: "How does it work?",
        steps: [
          "Go to 'Export' menu in toolbar",
          "Choose file type (Image, Plan, CAD)",
          "Select desired quality and settings",
          "Click 'Download' to save to device",
          "Or choose 'Share' to send link directly",
          "You can return and export other formats anytime"
        ]
      },
      faq: {
        title: "FAQ",
        list: [
          { q: "Is there a watermark on images?", a: "Yes in Free tier, removed in PRO and STUDIO tiers." },
          { q: "How long are files kept?", a: "Forever as long as your account is active." },
          { q: "Can I open files in other software?", a: "Yes, DXF and OBJ formats are compatible with most design apps." },
          { q: "Can plans be printed to scale?", a: "Yes, PDF files support printing to engineering scales." }
        ]
      },
      packages: PACKAGES.en
    }
  }
};
