(function () {
  "use strict";

  const STORAGE_KEYS = {
    language: "buniyaad.lang",
    projects: "buniyaad.projects",
    settings: "buniyaad.settings",
    materials: "buniyaad.materials",
    testimonials: "buniyaad.testimonials",
  };

  const SUPPORTED_LANGUAGES = ["en", "hi", "mr"];
  const LOCALES = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

  const TRANSLATIONS = {
    en: {
      "site.name": "Buniyaad Builders & Suppliers",
      "site.tagline": "Construction and building materials in Yavatmal",
      "skip.content": "Skip to main content",
      "nav.home": "Home",
      "nav.services": "Construction Services",
      "nav.construction": "Construction Services",
      "nav.materials": "Materials",
      "nav.projects": "Our Projects",
      "nav.process": "How It Works",
      "nav.testimonials": "Customer Feedback",
      "nav.faq": "FAQs",
      "nav.contact": "Contact",
      "nav.quote": "Request a Quote",
      "nav.admin": "Admin",
      "menu.open": "Open navigation menu",
      "menu.close": "Close navigation menu",
      "hero.eyebrow": "House construction & material supply in Yavatmal",
      "hero.kicker": "Local construction. Clear choices. One reliable contact.",
      "hero.title": "Your Home, Built on a Strong Foundation.",
      "hero.subtitle": "House construction with or without materials, plus sand, bricks, and cement supply in Yavatmal.",
      "hero.primary": "Discuss Your House Project",
      "hero.secondary": "Get Material Prices",
      "hero.local": "Serving Yavatmal",
      "hero.flexible": "With or without materials",
      "hero.supply": "Sand, bricks & cement",
      "hero.imageAlt": "A modern family home under warm evening light",
      "services.eyebrow": "Construction services",
      "services.title": "Choose the way you want to build",
      "services.intro": "Tell us your plot, requirements, and preferred working model. We will discuss the scope before preparing a quote.",
      "services.withMaterials.title": "House construction with materials",
      "services.withMaterials.description": "We manage the agreed construction labour and supply the materials included in your quotation.",
      "services.withMaterials.point1": "One coordinated construction plan",
      "services.withMaterials.point2": "Agreed material specifications",
      "services.withMaterials.point3": "Stage-wise progress discussion",
      "services.withoutMaterials.title": "House construction without materials",
      "services.withoutMaterials.description": "You arrange the materials; we handle the agreed construction work and labour.",
      "services.withoutMaterials.point1": "Labour and execution support",
      "services.withoutMaterials.point2": "Work based on the agreed scope",
      "services.withoutMaterials.point3": "Suitable when you source materials yourself",
      "services.supply.title": "Building material supply",
      "services.supply.description": "Enquire about sand, bricks, and cement. Delivery availability is confirmed for your location.",
      "services.supply.point1": "Quantity-based quotation",
      "services.supply.point2": "Delivery date coordination",
      "services.supply.point3": "Location-based availability",
      "services.cta": "Request a Construction Quote",
      "materials.eyebrow": "Building materials",
      "materials.title": "Essential materials, delivered where available",
      "materials.intro": "Share the required quantity and delivery location. We will confirm specifications, availability, delivery, and price.",
      "materials.sand.title": "Sand",
      "materials.sand.description": "Enquire about suitable sand for your construction requirement.",
      "materials.bricks.title": "Bricks",
      "materials.bricks.description": "Share the brick type and approximate quantity you need.",
      "materials.cement.title": "Cement",
      "materials.cement.description": "Tell us your preferred brand or ask for available options.",
      "materials.available": "Available on enquiry",
      "materials.unavailable": "Currently unavailable",
      "materials.confirm": "Delivery confirmed by location",
      "materials.updated": "Updated {date}",
      "materials.quote": "Get a Material Quote",
      "materials.select": "Select this material",
      "projects.eyebrow": "Project gallery",
      "projects.title": "See the work, stage by stage",
      "projects.intro": "Explore construction progress from foundation and brickwork to the completed home. Demo items are clearly marked until verified client projects are added.",
      "projects.filter.all": "All stages",
      "projects.filter.ongoing": "Ongoing",
      "projects.filter.completed": "Completed",
      "projects.filter.foundation": "Foundation",
      "projects.filter.structure": "Structure",
      "projects.filter.brickwork": "Brickwork",
      "projects.filter.plastering": "Plastering",
      "projects.empty": "No project photos match this filter yet.",
      "projects.demoBadge": "Demo project",
      "projects.viewPhoto": "View {stage} photo for {project}",
      "projects.location": "Location",
      "projects.area": "Area",
      "projects.scope": "Work handled",
      "projects.status": "Status",
      "projects.sample.title": "Sample Yavatmal home journey",
      "projects.sample.location": "Yavatmal — demonstration",
      "projects.sample.area": "Illustrative project",
      "projects.sample.scope": "Construction with materials",
      "projects.sample.foundationAlt": "Demonstration view of a house foundation stage",
      "projects.sample.brickworkAlt": "Demonstration view of a house brickwork stage",
      "projects.sample.completedAlt": "Demonstration view of a completed house",
      "stage.foundation": "Foundation",
      "stage.design": "Exterior design",
      "stage.structure": "Structure",
      "stage.brickwork": "Brickwork",
      "stage.plastering": "Plastering",
      "stage.completed": "Completed house",
      "status.ongoing": "Ongoing",
      "status.completed": "Completed",
      "scope.withMaterials": "Construction with materials",
      "scope.withoutMaterials": "Construction without materials",
      "scope.materialSupply": "Material supply",
      "lightbox.close": "Close project photo",
      "lightbox.previous": "Previous project photo",
      "lightbox.next": "Next project photo",
      "process.eyebrow": "A clear path forward",
      "process.title": "From first call to the next construction stage",
      "process.intro": "Every project is different, so the scope, material specifications, timeline, and price are discussed before work begins.",
      "process.step1.number": "01",
      "process.step1.title": "Share your requirement",
      "process.step1.description": "Tell us the plot location, approximate area, preferred service, or material quantity.",
      "process.step2.number": "02",
      "process.step2.title": "Discuss the site and scope",
      "process.step2.description": "We clarify the work, material responsibility, specifications, and delivery needs.",
      "process.step3.number": "03",
      "process.step3.title": "Receive a tailored quote",
      "process.step3.description": "Your quotation reflects the agreed scope, quantities, location, and schedule.",
      "process.step4.number": "04",
      "process.step4.title": "Plan the start",
      "process.step4.description": "After confirmation, we coordinate the work or material delivery for the agreed date.",
      "testimonials.eyebrow": "Customer feedback",
      "testimonials.title": "Feedback shared with permission",
      "testimonials.intro": "Verified customer comments will be shown here only after permission is received.",
      "testimonials.empty": "Customer feedback will appear here after it is approved for publication.",
      "testimonials.demoBadge": "Sample",
      "quote.eyebrow": "Tell us what you need",
      "quote.title": "Request a quote",
      "quote.intro": "Send a few project details. Your request will open in WhatsApp so you can review it before sending.",
      "quote.tab.construction": "Construction enquiry",
      "quote.tab.material": "Material enquiry",
      "forms.requiredNote": "Fields marked * are required.",
      "forms.name": "Name",
      "forms.namePlaceholder": "Your name",
      "forms.phone": "Phone number",
      "forms.phonePlaceholder": "10-digit mobile number",
      "forms.plotLocation": "Plot location",
      "forms.plotLocationPlaceholder": "Area or locality in/near Yavatmal",
      "forms.area": "Approximate plot or built-up area",
      "forms.areaPlaceholder": "For example, 1,200 sq ft",
      "forms.constructionType": "How would you like to build?",
      "forms.selectOption": "Select an option",
      "forms.withMaterials": "With materials",
      "forms.withoutMaterials": "Without materials",
      "forms.needAdvice": "I need advice",
      "forms.startDate": "Expected start date",
      "forms.notes": "Anything else we should know?",
      "forms.notesPlaceholder": "Share floors, room needs, plan status, or questions",
      "forms.material": "Material",
      "forms.quantity": "Required quantity",
      "forms.quantityPlaceholder": "For example, 5 tonnes or 2,000 bricks",
      "forms.deliveryLocation": "Delivery location",
      "forms.deliveryLocationPlaceholder": "Village, area, or full delivery location",
      "forms.deliveryDate": "Required delivery date",
      "forms.submitConstruction": "Send Construction Enquiry",
      "forms.submitMaterial": "Send Material Enquiry",
      "forms.whatsappHint": "Opens WhatsApp with your enquiry ready to send.",
      "forms.invalid": "Please complete the required fields.",
      "forms.invalidPhone": "Please enter a valid phone number.",
      "forms.openingWhatsapp": "Opening your enquiry in WhatsApp…",
      "forms.materialSelected": "{material} selected. Add the quantity and delivery details.",
      "message.general": "Hello {business}, I would like to discuss construction or building materials in Yavatmal.",
      "message.constructionTitle": "Hello {business}, I would like a construction quote.",
      "message.materialTitle": "Hello {business}, I would like a building material quote.",
      "message.name": "Name",
      "message.phone": "Phone",
      "message.location": "Plot location",
      "message.area": "Approximate area",
      "message.constructionType": "Construction preference",
      "message.startDate": "Expected start date",
      "message.material": "Material",
      "message.quantity": "Required quantity",
      "message.deliveryLocation": "Delivery location",
      "message.deliveryDate": "Required delivery date",
      "message.notes": "Additional details",
      "faq.eyebrow": "Frequently asked questions",
      "faq.title": "Useful answers before you enquire",
      "faq.intro": "Final scope, availability, specifications, timing, and pricing are confirmed after discussing your requirement.",
      "faq.q1": "Can you build a house with materials included?",
      "faq.a1": "Yes. We can discuss a construction package where labour and the agreed materials are included in the quotation.",
      "faq.q2": "Can I purchase my own materials?",
      "faq.a2": "Yes. Choose construction without materials when you want to arrange materials and need us to handle the agreed work and labour.",
      "faq.q3": "Do you deliver sand, bricks, and cement?",
      "faq.a3": "Delivery availability depends on the material, quantity, delivery location, and requested date. Send these details for confirmation.",
      "faq.q4": "Why are prices shown as ‘Request a Quote’?",
      "faq.a4": "Construction scope, material specifications, quantities, transport, and location affect the final price, so each quotation is prepared for the enquiry.",
      "faq.q5": "What details should I share for a house project?",
      "faq.a5": "Share your plot location, approximate area, whether you want materials included, expected start date, and any available plan details.",
      "contact.eyebrow": "Let’s discuss your requirement",
      "contact.title": "Planning a home or ordering materials in Yavatmal?",
      "contact.description": "Send an enquiry and we will discuss the scope, availability, and next steps.",
      "contact.call": "Call us",
      "contact.whatsapp": "Chat on WhatsApp",
      "contact.quote": "Request a Quote",
      "contact.location": "Yavatmal, Maharashtra",
      "footer.about": "House construction with or without materials, plus sand, bricks, and cement enquiries in Yavatmal.",
      "footer.links": "Quick links",
      "footer.services": "Services",
      "footer.contact": "Contact",
      "footer.constructionWith": "Construction with materials",
      "footer.constructionWithout": "Construction without materials",
      "footer.materialSupply": "Building material supply",
      "footer.location": "Yavatmal, Maharashtra",
      "footer.rights": "All rights reserved.",
      "footer.disclaimer": "Availability, specifications, timelines, delivery, and prices are confirmed for each enquiry.",
    },
    hi: {
      "site.name": "बुनियाद बिल्डर्स एंड सप्लायर्स",
      "site.tagline": "यवतमाल में निर्माण और बिल्डिंग मटेरियल",
      "skip.content": "मुख्य सामग्री पर जाएँ",
      "nav.home": "होम",
      "nav.services": "निर्माण सेवाएँ",
      "nav.construction": "निर्माण सेवाएँ",
      "nav.materials": "निर्माण सामग्री",
      "nav.projects": "हमारे प्रोजेक्ट",
      "nav.process": "काम कैसे होता है",
      "nav.testimonials": "ग्राहक प्रतिक्रिया",
      "nav.faq": "सामान्य प्रश्न",
      "nav.contact": "संपर्क",
      "nav.quote": "कोटेशन माँगें",
      "nav.admin": "एडमिन",
      "menu.open": "नेविगेशन मेनू खोलें",
      "menu.close": "नेविगेशन मेनू बंद करें",
      "hero.eyebrow": "यवतमाल में घर निर्माण और सामग्री सप्लाई",
      "hero.kicker": "स्थानीय निर्माण। साफ विकल्प। एक भरोसेमंद संपर्क।",
      "hero.title": "आपका घर, मज़बूत बुनियाद पर।",
      "hero.subtitle": "यवतमाल में सामग्री सहित या बिना सामग्री घर निर्माण, साथ ही रेत, ईंट और सीमेंट की सप्लाई।",
      "hero.primary": "अपने घर के प्रोजेक्ट पर बात करें",
      "hero.secondary": "सामग्री की कीमत पूछें",
      "hero.local": "यवतमाल में सेवा",
      "hero.flexible": "सामग्री सहित या बिना सामग्री",
      "hero.supply": "रेत, ईंट और सीमेंट",
      "hero.imageAlt": "शाम की रोशनी में एक आधुनिक पारिवारिक घर",
      "services.eyebrow": "निर्माण सेवाएँ",
      "services.title": "अपनी पसंद से घर बनवाएँ",
      "services.intro": "प्लॉट, आवश्यकता और काम का पसंदीदा तरीका बताएँ। कोटेशन बनाने से पहले हम पूरा दायरा समझेंगे।",
      "services.withMaterials.title": "सामग्री सहित घर निर्माण",
      "services.withMaterials.description": "हम तय निर्माण श्रम संभालते हैं और आपके कोटेशन में शामिल सामग्री उपलब्ध कराते हैं।",
      "services.withMaterials.point1": "एक समन्वित निर्माण योजना",
      "services.withMaterials.point2": "तय सामग्री विनिर्देश",
      "services.withMaterials.point3": "हर चरण की प्रगति पर चर्चा",
      "services.withoutMaterials.title": "बिना सामग्री घर निर्माण",
      "services.withoutMaterials.description": "सामग्री आप खरीदते हैं; तय निर्माण कार्य और श्रम हम संभालते हैं।",
      "services.withoutMaterials.point1": "श्रम और कार्य निष्पादन",
      "services.withoutMaterials.point2": "तय दायरे के अनुसार काम",
      "services.withoutMaterials.point3": "खुद सामग्री खरीदने वालों के लिए उपयुक्त",
      "services.supply.title": "निर्माण सामग्री सप्लाई",
      "services.supply.description": "रेत, ईंट और सीमेंट के लिए पूछताछ करें। आपके स्थान के अनुसार डिलीवरी की पुष्टि की जाएगी।",
      "services.supply.point1": "मात्रा के अनुसार कोटेशन",
      "services.supply.point2": "डिलीवरी तारीख का समन्वय",
      "services.supply.point3": "स्थान के अनुसार उपलब्धता",
      "services.cta": "निर्माण कोटेशन माँगें",
      "materials.eyebrow": "निर्माण सामग्री",
      "materials.title": "ज़रूरी सामग्री, उपलब्ध क्षेत्र में डिलीवरी के साथ",
      "materials.intro": "ज़रूरी मात्रा और डिलीवरी स्थान बताएँ। हम विनिर्देश, उपलब्धता, डिलीवरी और कीमत की पुष्टि करेंगे।",
      "materials.sand.title": "रेत",
      "materials.sand.description": "अपनी निर्माण आवश्यकता के लिए उपयुक्त रेत के बारे में पूछें।",
      "materials.bricks.title": "ईंट",
      "materials.bricks.description": "ईंट का प्रकार और अनुमानित मात्रा बताएँ।",
      "materials.cement.title": "सीमेंट",
      "materials.cement.description": "पसंदीदा ब्रांड बताएँ या उपलब्ध विकल्प पूछें।",
      "materials.available": "पूछताछ पर उपलब्ध",
      "materials.unavailable": "फिलहाल उपलब्ध नहीं",
      "materials.confirm": "स्थान के अनुसार डिलीवरी की पुष्टि",
      "materials.updated": "{date} को अपडेट किया गया",
      "materials.quote": "सामग्री का कोटेशन लें",
      "materials.select": "यह सामग्री चुनें",
      "projects.eyebrow": "प्रोजेक्ट गैलरी",
      "projects.title": "हर चरण का काम देखें",
      "projects.intro": "नींव और ईंट के काम से लेकर तैयार घर तक निर्माण की प्रगति देखें। सत्यापित ग्राहक प्रोजेक्ट जुड़ने तक डेमो सामग्री साफ तौर पर चिन्हित है।",
      "projects.filter.all": "सभी चरण",
      "projects.filter.ongoing": "काम जारी",
      "projects.filter.completed": "पूर्ण",
      "projects.filter.foundation": "नींव",
      "projects.filter.structure": "ढांचा",
      "projects.filter.brickwork": "ईंट का काम",
      "projects.filter.plastering": "प्लास्टर",
      "projects.empty": "इस फ़िल्टर के लिए अभी कोई प्रोजेक्ट फोटो नहीं है।",
      "projects.demoBadge": "डेमो प्रोजेक्ट",
      "projects.viewPhoto": "{project} की {stage} फोटो देखें",
      "projects.location": "स्थान",
      "projects.area": "क्षेत्रफल",
      "projects.scope": "किया गया काम",
      "projects.status": "स्थिति",
      "projects.sample.title": "यवतमाल घर का नमूना सफर",
      "projects.sample.location": "यवतमाल — प्रदर्शन",
      "projects.sample.area": "उदाहरण प्रोजेक्ट",
      "projects.sample.scope": "सामग्री सहित निर्माण",
      "projects.sample.foundationAlt": "घर की नींव के चरण का प्रदर्शन दृश्य",
      "projects.sample.brickworkAlt": "घर में ईंट के काम के चरण का प्रदर्शन दृश्य",
      "projects.sample.completedAlt": "तैयार घर का प्रदर्शन दृश्य",
      "stage.foundation": "नींव",
      "stage.design": "बाहरी डिज़ाइन",
      "stage.structure": "ढांचा",
      "stage.brickwork": "ईंट का काम",
      "stage.plastering": "प्लास्टर",
      "stage.completed": "तैयार घर",
      "status.ongoing": "काम जारी",
      "status.completed": "पूर्ण",
      "scope.withMaterials": "सामग्री सहित निर्माण",
      "scope.withoutMaterials": "बिना सामग्री निर्माण",
      "scope.materialSupply": "सामग्री सप्लाई",
      "lightbox.close": "प्रोजेक्ट फोटो बंद करें",
      "lightbox.previous": "पिछली प्रोजेक्ट फोटो",
      "lightbox.next": "अगली प्रोजेक्ट फोटो",
      "process.eyebrow": "आगे बढ़ने का साफ तरीका",
      "process.title": "पहली बातचीत से अगले निर्माण चरण तक",
      "process.intro": "हर प्रोजेक्ट अलग होता है, इसलिए काम शुरू होने से पहले दायरा, सामग्री विनिर्देश, समय और कीमत पर चर्चा होती है।",
      "process.step1.number": "01",
      "process.step1.title": "अपनी आवश्यकता बताएँ",
      "process.step1.description": "प्लॉट स्थान, अनुमानित क्षेत्र, पसंदीदा सेवा या सामग्री की मात्रा बताएँ।",
      "process.step2.number": "02",
      "process.step2.title": "साइट और काम के दायरे पर चर्चा",
      "process.step2.description": "हम काम, सामग्री की जिम्मेदारी, विनिर्देश और डिलीवरी की ज़रूरत स्पष्ट करते हैं।",
      "process.step3.number": "03",
      "process.step3.title": "ज़रूरत के अनुसार कोटेशन पाएँ",
      "process.step3.description": "कोटेशन तय दायरे, मात्रा, स्थान और समय-सारणी के अनुसार होगा।",
      "process.step4.number": "04",
      "process.step4.title": "शुरुआत की योजना बनाएँ",
      "process.step4.description": "पुष्टि के बाद तय तारीख के लिए काम या सामग्री डिलीवरी का समन्वय किया जाता है।",
      "testimonials.eyebrow": "ग्राहक प्रतिक्रिया",
      "testimonials.title": "अनुमति से साझा की गई प्रतिक्रिया",
      "testimonials.intro": "ग्राहक की अनुमति मिलने के बाद ही सत्यापित प्रतिक्रिया यहाँ दिखाई जाएगी।",
      "testimonials.empty": "प्रकाशन की अनुमति मिलने पर ग्राहक प्रतिक्रिया यहाँ दिखाई जाएगी।",
      "testimonials.demoBadge": "नमूना",
      "quote.eyebrow": "अपनी ज़रूरत बताएँ",
      "quote.title": "कोटेशन माँगें",
      "quote.intro": "कुछ प्रोजेक्ट विवरण भेजें। आपका संदेश WhatsApp में खुलेगा, जहाँ भेजने से पहले आप उसे देख सकते हैं।",
      "quote.tab.construction": "निर्माण पूछताछ",
      "quote.tab.material": "सामग्री पूछताछ",
      "forms.requiredNote": "* वाले फ़ील्ड आवश्यक हैं।",
      "forms.name": "नाम",
      "forms.namePlaceholder": "आपका नाम",
      "forms.phone": "फोन नंबर",
      "forms.phonePlaceholder": "10 अंकों का मोबाइल नंबर",
      "forms.plotLocation": "प्लॉट का स्थान",
      "forms.plotLocationPlaceholder": "यवतमाल या आसपास का क्षेत्र",
      "forms.area": "अनुमानित प्लॉट या निर्मित क्षेत्र",
      "forms.areaPlaceholder": "जैसे, 1,200 वर्ग फुट",
      "forms.constructionType": "आप किस तरह निर्माण चाहते हैं?",
      "forms.selectOption": "एक विकल्प चुनें",
      "forms.withMaterials": "सामग्री सहित",
      "forms.withoutMaterials": "बिना सामग्री",
      "forms.needAdvice": "मुझे सलाह चाहिए",
      "forms.startDate": "शुरू करने की संभावित तारीख",
      "forms.notes": "और कोई जानकारी?",
      "forms.notesPlaceholder": "मंज़िल, कमरों, नक्शे की स्थिति या सवाल बताएँ",
      "forms.material": "सामग्री",
      "forms.quantity": "आवश्यक मात्रा",
      "forms.quantityPlaceholder": "जैसे, 5 टन या 2,000 ईंट",
      "forms.deliveryLocation": "डिलीवरी स्थान",
      "forms.deliveryLocationPlaceholder": "गाँव, क्षेत्र या पूरा डिलीवरी पता",
      "forms.deliveryDate": "आवश्यक डिलीवरी तारीख",
      "forms.submitConstruction": "निर्माण पूछताछ भेजें",
      "forms.submitMaterial": "सामग्री पूछताछ भेजें",
      "forms.whatsappHint": "आपकी तैयार पूछताछ WhatsApp में खुलेगी।",
      "forms.invalid": "कृपया आवश्यक जानकारी पूरी करें।",
      "forms.invalidPhone": "कृपया सही फोन नंबर डालें।",
      "forms.openingWhatsapp": "आपकी पूछताछ WhatsApp में खोली जा रही है…",
      "forms.materialSelected": "{material} चुना गया है। मात्रा और डिलीवरी विवरण भरें।",
      "message.general": "नमस्ते {business}, मैं यवतमाल में निर्माण या निर्माण सामग्री के बारे में बात करना चाहता/चाहती हूँ।",
      "message.constructionTitle": "नमस्ते {business}, मुझे घर निर्माण का कोटेशन चाहिए।",
      "message.materialTitle": "नमस्ते {business}, मुझे निर्माण सामग्री का कोटेशन चाहिए।",
      "message.name": "नाम",
      "message.phone": "फोन",
      "message.location": "प्लॉट का स्थान",
      "message.area": "अनुमानित क्षेत्र",
      "message.constructionType": "निर्माण का विकल्प",
      "message.startDate": "संभावित शुरुआत",
      "message.material": "सामग्री",
      "message.quantity": "आवश्यक मात्रा",
      "message.deliveryLocation": "डिलीवरी स्थान",
      "message.deliveryDate": "आवश्यक डिलीवरी तारीख",
      "message.notes": "अतिरिक्त जानकारी",
      "faq.eyebrow": "अक्सर पूछे जाने वाले प्रश्न",
      "faq.title": "पूछताछ से पहले उपयोगी जवाब",
      "faq.intro": "अंतिम दायरा, उपलब्धता, विनिर्देश, समय और कीमत आपकी आवश्यकता समझने के बाद तय होते हैं।",
      "faq.q1": "क्या आप सामग्री सहित घर बनाते हैं?",
      "faq.a1": "हाँ। हम ऐसा निर्माण पैकेज तय कर सकते हैं जिसमें श्रम और कोटेशन में सहमत सामग्री शामिल हो।",
      "faq.q2": "क्या मैं सामग्री खुद खरीद सकता/सकती हूँ?",
      "faq.a2": "हाँ। यदि आप सामग्री खुद खरीदना चाहते हैं और हमसे तय काम व श्रम करवाना चाहते हैं, तो बिना सामग्री निर्माण चुनें।",
      "faq.q3": "क्या आप रेत, ईंट और सीमेंट की डिलीवरी करते हैं?",
      "faq.a3": "डिलीवरी सामग्री, मात्रा, स्थान और तारीख पर निर्भर करती है। पुष्टि के लिए ये विवरण भेजें।",
      "faq.q4": "कीमत की जगह ‘कोटेशन माँगें’ क्यों लिखा है?",
      "faq.a4": "निर्माण दायरा, सामग्री विनिर्देश, मात्रा, परिवहन और स्थान से अंतिम कीमत बदलती है, इसलिए हर पूछताछ का अलग कोटेशन बनता है।",
      "faq.q5": "घर के प्रोजेक्ट के लिए क्या जानकारी भेजूँ?",
      "faq.a5": "प्लॉट स्थान, अनुमानित क्षेत्र, सामग्री शामिल चाहिए या नहीं, संभावित शुरुआत और उपलब्ध नक्शे का विवरण भेजें।",
      "contact.eyebrow": "अपनी ज़रूरत पर बात करें",
      "contact.title": "यवतमाल में घर की योजना या सामग्री का ऑर्डर?",
      "contact.description": "पूछताछ भेजें और हम दायरे, उपलब्धता और अगले कदम पर चर्चा करेंगे।",
      "contact.call": "कॉल करें",
      "contact.whatsapp": "WhatsApp पर बात करें",
      "contact.quote": "कोटेशन माँगें",
      "contact.location": "यवतमाल, महाराष्ट्र",
      "footer.about": "यवतमाल में सामग्री सहित या बिना सामग्री घर निर्माण, साथ ही रेत, ईंट और सीमेंट की पूछताछ।",
      "footer.links": "ज़रूरी लिंक",
      "footer.services": "सेवाएँ",
      "footer.contact": "संपर्क",
      "footer.constructionWith": "सामग्री सहित निर्माण",
      "footer.constructionWithout": "बिना सामग्री निर्माण",
      "footer.materialSupply": "निर्माण सामग्री सप्लाई",
      "footer.location": "यवतमाल, महाराष्ट्र",
      "footer.rights": "सर्वाधिकार सुरक्षित।",
      "footer.disclaimer": "उपलब्धता, विनिर्देश, समय, डिलीवरी और कीमत हर पूछताछ के लिए अलग से तय होंगे।",
    },
    mr: {
      "site.name": "बुनियाद बिल्डर्स अँड सप्लायर्स",
      "site.tagline": "यवतमाळमधील बांधकाम आणि बांधकाम साहित्य",
      "skip.content": "मुख्य मजकुराकडे जा",
      "nav.home": "मुख्यपृष्ठ",
      "nav.services": "बांधकाम सेवा",
      "nav.construction": "बांधकाम सेवा",
      "nav.materials": "बांधकाम साहित्य",
      "nav.projects": "आमचे प्रकल्प",
      "nav.process": "कामाची पद्धत",
      "nav.testimonials": "ग्राहक अभिप्राय",
      "nav.faq": "सामान्य प्रश्न",
      "nav.contact": "संपर्क",
      "nav.quote": "कोटेशन मागवा",
      "nav.admin": "अ‍ॅडमिन",
      "menu.open": "नेव्हिगेशन मेनू उघडा",
      "menu.close": "नेव्हिगेशन मेनू बंद करा",
      "hero.eyebrow": "यवतमाळमध्ये घर बांधकाम आणि साहित्य पुरवठा",
      "hero.kicker": "स्थानिक बांधकाम. स्पष्ट पर्याय. एक विश्वासार्ह संपर्क.",
      "hero.title": "तुमचे घर, मजबूत पायावर उभे.",
      "hero.subtitle": "यवतमाळमध्ये साहित्यासह किंवा साहित्याविना घर बांधकाम, तसेच वाळू, विटा आणि सिमेंटचा पुरवठा.",
      "hero.primary": "घराच्या प्रकल्पाबद्दल चर्चा करा",
      "hero.secondary": "साहित्याचे दर विचारा",
      "hero.local": "यवतमाळमध्ये सेवा",
      "hero.flexible": "साहित्यासह किंवा साहित्याविना",
      "hero.supply": "वाळू, विटा आणि सिमेंट",
      "hero.imageAlt": "संध्याकाळच्या प्रकाशातील आधुनिक कुटुंबीय घर",
      "services.eyebrow": "बांधकाम सेवा",
      "services.title": "तुमच्या पसंतीच्या पद्धतीने घर बांधा",
      "services.intro": "प्लॉट, गरज आणि कामाची पसंतीची पद्धत सांगा. कोटेशन देण्यापूर्वी आम्ही कामाची व्याप्ती समजून घेऊ.",
      "services.withMaterials.title": "साहित्यासह घर बांधकाम",
      "services.withMaterials.description": "आम्ही ठरलेले बांधकाम मजूरकाम सांभाळतो आणि कोटेशनमध्ये समाविष्ट साहित्य पुरवतो.",
      "services.withMaterials.point1": "एकत्रित बांधकाम नियोजन",
      "services.withMaterials.point2": "ठरलेली साहित्य वैशिष्ट्ये",
      "services.withMaterials.point3": "टप्प्यानुसार प्रगतीची चर्चा",
      "services.withoutMaterials.title": "साहित्याविना घर बांधकाम",
      "services.withoutMaterials.description": "साहित्य तुम्ही आणता; ठरलेले बांधकाम आणि मजूरकाम आम्ही सांभाळतो.",
      "services.withoutMaterials.point1": "मजूर आणि कामाची अंमलबजावणी",
      "services.withoutMaterials.point2": "ठरलेल्या व्याप्तीनुसार काम",
      "services.withoutMaterials.point3": "स्वतः साहित्य घेणाऱ्यांसाठी योग्य",
      "services.supply.title": "बांधकाम साहित्य पुरवठा",
      "services.supply.description": "वाळू, विटा आणि सिमेंटसाठी चौकशी करा. तुमच्या ठिकाणानुसार डिलिव्हरीची उपलब्धता निश्चित केली जाईल.",
      "services.supply.point1": "प्रमाणानुसार कोटेशन",
      "services.supply.point2": "डिलिव्हरी तारखेचे नियोजन",
      "services.supply.point3": "ठिकाणानुसार उपलब्धता",
      "services.cta": "बांधकाम कोटेशन मागवा",
      "materials.eyebrow": "बांधकाम साहित्य",
      "materials.title": "आवश्यक साहित्य, उपलब्ध ठिकाणी डिलिव्हरीसह",
      "materials.intro": "आवश्यक प्रमाण आणि डिलिव्हरीचे ठिकाण सांगा. आम्ही वैशिष्ट्ये, उपलब्धता, डिलिव्हरी आणि किंमत निश्चित करू.",
      "materials.sand.title": "वाळू",
      "materials.sand.description": "तुमच्या बांधकामासाठी योग्य वाळूबद्दल चौकशी करा.",
      "materials.bricks.title": "विटा",
      "materials.bricks.description": "विटांचा प्रकार आणि अंदाजे प्रमाण सांगा.",
      "materials.cement.title": "सिमेंट",
      "materials.cement.description": "पसंतीचा ब्रँड सांगा किंवा उपलब्ध पर्याय विचारा.",
      "materials.available": "चौकशीवर उपलब्ध",
      "materials.unavailable": "सध्या उपलब्ध नाही",
      "materials.confirm": "ठिकाणानुसार डिलिव्हरी निश्चित",
      "materials.updated": "{date} रोजी अद्ययावत",
      "materials.quote": "साहित्याचे कोटेशन घ्या",
      "materials.select": "हे साहित्य निवडा",
      "projects.eyebrow": "प्रकल्प गॅलरी",
      "projects.title": "प्रत्येक टप्प्यातील काम पाहा",
      "projects.intro": "पायाभरणी आणि वीटकामापासून पूर्ण घरापर्यंतची प्रगती पाहा. पडताळलेले ग्राहक प्रकल्प जोडले जाईपर्यंत नमुना मजकूर स्पष्टपणे दर्शवला आहे.",
      "projects.filter.all": "सर्व टप्पे",
      "projects.filter.ongoing": "काम सुरू",
      "projects.filter.completed": "पूर्ण",
      "projects.filter.foundation": "पायाभरणी",
      "projects.filter.structure": "सांगाडा",
      "projects.filter.brickwork": "वीटकाम",
      "projects.filter.plastering": "प्लास्टर",
      "projects.empty": "या फिल्टरसाठी अद्याप कोणतेही प्रकल्प छायाचित्र नाही.",
      "projects.demoBadge": "नमुना प्रकल्प",
      "projects.viewPhoto": "{project}चे {stage} छायाचित्र पाहा",
      "projects.location": "ठिकाण",
      "projects.area": "क्षेत्रफळ",
      "projects.scope": "केलेले काम",
      "projects.status": "स्थिती",
      "projects.sample.title": "यवतमाळमधील घराचा नमुना प्रवास",
      "projects.sample.location": "यवतमाळ — प्रात्यक्षिक",
      "projects.sample.area": "उदाहरण प्रकल्प",
      "projects.sample.scope": "साहित्यासह बांधकाम",
      "projects.sample.foundationAlt": "घराच्या पायाभरणीच्या टप्प्याचे प्रात्यक्षिक दृश्य",
      "projects.sample.brickworkAlt": "घराच्या वीटकामाच्या टप्प्याचे प्रात्यक्षिक दृश्य",
      "projects.sample.completedAlt": "पूर्ण घराचे प्रात्यक्षिक दृश्य",
      "stage.foundation": "पायाभरणी",
      "stage.design": "बाह्य रचना",
      "stage.structure": "सांगाडा",
      "stage.brickwork": "वीटकाम",
      "stage.plastering": "प्लास्टर",
      "stage.completed": "पूर्ण घर",
      "status.ongoing": "काम सुरू",
      "status.completed": "पूर्ण",
      "scope.withMaterials": "साहित्यासह बांधकाम",
      "scope.withoutMaterials": "साहित्याविना बांधकाम",
      "scope.materialSupply": "साहित्य पुरवठा",
      "lightbox.close": "प्रकल्पाचे छायाचित्र बंद करा",
      "lightbox.previous": "मागील प्रकल्प छायाचित्र",
      "lightbox.next": "पुढील प्रकल्प छायाचित्र",
      "process.eyebrow": "पुढे जाण्याची स्पष्ट पद्धत",
      "process.title": "पहिल्या चर्चेपासून पुढील बांधकाम टप्प्यापर्यंत",
      "process.intro": "प्रत्येक प्रकल्प वेगळा असतो, म्हणून काम सुरू करण्यापूर्वी व्याप्ती, साहित्य वैशिष्ट्ये, कालावधी आणि किंमत यांवर चर्चा केली जाते.",
      "process.step1.number": "01",
      "process.step1.title": "तुमची गरज सांगा",
      "process.step1.description": "प्लॉटचे ठिकाण, अंदाजे क्षेत्रफळ, पसंतीची सेवा किंवा साहित्याचे प्रमाण सांगा.",
      "process.step2.number": "02",
      "process.step2.title": "साइट आणि कामाची चर्चा",
      "process.step2.description": "काम, साहित्याची जबाबदारी, वैशिष्ट्ये आणि डिलिव्हरीची गरज स्पष्ट केली जाते.",
      "process.step3.number": "03",
      "process.step3.title": "गरजेनुसार कोटेशन मिळवा",
      "process.step3.description": "कोटेशन ठरलेली व्याप्ती, प्रमाण, ठिकाण आणि वेळापत्रकानुसार असेल.",
      "process.step4.number": "04",
      "process.step4.title": "सुरुवातीचे नियोजन करा",
      "process.step4.description": "पुष्टीनंतर ठरलेल्या तारखेला काम किंवा साहित्य डिलिव्हरीचे नियोजन केले जाते.",
      "testimonials.eyebrow": "ग्राहक अभिप्राय",
      "testimonials.title": "परवानगीने शेअर केलेला अभिप्राय",
      "testimonials.intro": "ग्राहकाची परवानगी मिळाल्यानंतरच पडताळलेला अभिप्राय येथे दाखवला जाईल.",
      "testimonials.empty": "प्रकाशनाची परवानगी मिळाल्यानंतर ग्राहक अभिप्राय येथे दिसेल.",
      "testimonials.demoBadge": "नमुना",
      "quote.eyebrow": "तुमची गरज सांगा",
      "quote.title": "कोटेशन मागवा",
      "quote.intro": "प्रकल्पाची थोडी माहिती पाठवा. तुमचा संदेश WhatsApp मध्ये उघडेल आणि पाठवण्यापूर्वी तुम्ही तो तपासू शकता.",
      "quote.tab.construction": "बांधकाम चौकशी",
      "quote.tab.material": "साहित्य चौकशी",
      "forms.requiredNote": "* असलेली माहिती आवश्यक आहे.",
      "forms.name": "नाव",
      "forms.namePlaceholder": "तुमचे नाव",
      "forms.phone": "फोन नंबर",
      "forms.phonePlaceholder": "10 अंकी मोबाइल नंबर",
      "forms.plotLocation": "प्लॉटचे ठिकाण",
      "forms.plotLocationPlaceholder": "यवतमाळ किंवा जवळचा परिसर",
      "forms.area": "अंदाजे प्लॉट किंवा बांधकाम क्षेत्र",
      "forms.areaPlaceholder": "उदा., 1,200 चौरस फूट",
      "forms.constructionType": "तुम्हाला कोणत्या पद्धतीने बांधकाम हवे आहे?",
      "forms.selectOption": "एक पर्याय निवडा",
      "forms.withMaterials": "साहित्यासह",
      "forms.withoutMaterials": "साहित्याविना",
      "forms.needAdvice": "मला सल्ला हवा आहे",
      "forms.startDate": "काम सुरू करण्याची अपेक्षित तारीख",
      "forms.notes": "आणखी काही माहिती?",
      "forms.notesPlaceholder": "मजले, खोल्या, नकाशाची स्थिती किंवा प्रश्न सांगा",
      "forms.material": "साहित्य",
      "forms.quantity": "आवश्यक प्रमाण",
      "forms.quantityPlaceholder": "उदा., 5 टन किंवा 2,000 विटा",
      "forms.deliveryLocation": "डिलिव्हरीचे ठिकाण",
      "forms.deliveryLocationPlaceholder": "गाव, परिसर किंवा पूर्ण डिलिव्हरी पत्ता",
      "forms.deliveryDate": "आवश्यक डिलिव्हरी तारीख",
      "forms.submitConstruction": "बांधकाम चौकशी पाठवा",
      "forms.submitMaterial": "साहित्य चौकशी पाठवा",
      "forms.whatsappHint": "तुमची तयार चौकशी WhatsApp मध्ये उघडेल.",
      "forms.invalid": "कृपया आवश्यक माहिती पूर्ण भरा.",
      "forms.invalidPhone": "कृपया योग्य फोन नंबर भरा.",
      "forms.openingWhatsapp": "तुमची चौकशी WhatsApp मध्ये उघडत आहे…",
      "forms.materialSelected": "{material} निवडले आहे. प्रमाण आणि डिलिव्हरीची माहिती भरा.",
      "message.general": "नमस्कार {business}, मला यवतमाळमधील बांधकाम किंवा बांधकाम साहित्याबद्दल चर्चा करायची आहे.",
      "message.constructionTitle": "नमस्कार {business}, मला घर बांधकामाचे कोटेशन हवे आहे.",
      "message.materialTitle": "नमस्कार {business}, मला बांधकाम साहित्याचे कोटेशन हवे आहे.",
      "message.name": "नाव",
      "message.phone": "फोन",
      "message.location": "प्लॉटचे ठिकाण",
      "message.area": "अंदाजे क्षेत्रफळ",
      "message.constructionType": "बांधकामाचा पर्याय",
      "message.startDate": "अपेक्षित सुरुवात",
      "message.material": "साहित्य",
      "message.quantity": "आवश्यक प्रमाण",
      "message.deliveryLocation": "डिलिव्हरीचे ठिकाण",
      "message.deliveryDate": "आवश्यक डिलिव्हरी तारीख",
      "message.notes": "अतिरिक्त माहिती",
      "faq.eyebrow": "नेहमी विचारले जाणारे प्रश्न",
      "faq.title": "चौकशीपूर्वी उपयोगी उत्तरे",
      "faq.intro": "अंतिम व्याप्ती, उपलब्धता, वैशिष्ट्ये, वेळ आणि किंमत तुमची गरज समजल्यानंतर निश्चित केली जाते.",
      "faq.q1": "तुम्ही साहित्यासह घर बांधता का?",
      "faq.a1": "होय. मजूरकाम आणि कोटेशनमध्ये ठरलेले साहित्य समाविष्ट असलेले बांधकाम पॅकेज आपण ठरवू शकतो.",
      "faq.q2": "मी साहित्य स्वतः खरेदी करू शकतो का?",
      "faq.a2": "होय. साहित्य स्वतः घेऊन ठरलेले काम आणि मजूरकाम आमच्याकडून करून घ्यायचे असल्यास साहित्याविना बांधकाम निवडा.",
      "faq.q3": "वाळू, विटा आणि सिमेंटची डिलिव्हरी करता का?",
      "faq.a3": "डिलिव्हरी साहित्य, प्रमाण, ठिकाण आणि आवश्यक तारखेवर अवलंबून असते. पुष्टीसाठी ही माहिती पाठवा.",
      "faq.q4": "किमतीऐवजी ‘कोटेशन मागवा’ का आहे?",
      "faq.a4": "बांधकामाची व्याप्ती, साहित्य वैशिष्ट्ये, प्रमाण, वाहतूक आणि ठिकाण यामुळे अंतिम किंमत बदलते, म्हणून प्रत्येक चौकशीसाठी स्वतंत्र कोटेशन दिले जाते.",
      "faq.q5": "घराच्या प्रकल्पासाठी कोणती माहिती द्यावी?",
      "faq.a5": "प्लॉटचे ठिकाण, अंदाजे क्षेत्रफळ, साहित्य समाविष्ट हवे की नाही, अपेक्षित सुरुवात आणि उपलब्ध नकाशाची माहिती द्या.",
      "contact.eyebrow": "तुमच्या गरजेबद्दल चर्चा करूया",
      "contact.title": "यवतमाळमध्ये घराचे नियोजन किंवा साहित्याची ऑर्डर?",
      "contact.description": "चौकशी पाठवा आणि आम्ही व्याप्ती, उपलब्धता आणि पुढील टप्प्यांबद्दल चर्चा करू.",
      "contact.call": "कॉल करा",
      "contact.whatsapp": "WhatsApp वर बोला",
      "contact.quote": "कोटेशन मागवा",
      "contact.location": "यवतमाळ, महाराष्ट्र",
      "footer.about": "यवतमाळमध्ये साहित्यासह किंवा साहित्याविना घर बांधकाम, तसेच वाळू, विटा आणि सिमेंटची चौकशी.",
      "footer.links": "महत्त्वाचे दुवे",
      "footer.services": "सेवा",
      "footer.contact": "संपर्क",
      "footer.constructionWith": "साहित्यासह बांधकाम",
      "footer.constructionWithout": "साहित्याविना बांधकाम",
      "footer.materialSupply": "बांधकाम साहित्य पुरवठा",
      "footer.location": "यवतमाळ, महाराष्ट्र",
      "footer.rights": "सर्व हक्क राखीव.",
      "footer.disclaimer": "उपलब्धता, वैशिष्ट्ये, कालावधी, डिलिव्हरी आणि किंमत प्रत्येक चौकशीनुसार निश्चित केली जाईल.",
    },
  };

  // Copy that is specific to the authored page structure. Keeping these keys
  // separate makes the broader translation dictionary reusable by dynamic UI.
  const PAGE_TRANSLATIONS = {
    en: {
      "topbar.note": "Private preview · Working name can be changed anytime",
      "hero.titleA": "Your home, built on",
      "hero.titleB": "a strong foundation.",
      "hero.imageLabel": "Ongoing project · Exterior design visualisation, not completed work",
      "hero.stageTitle": "Neoclassical residence — under construction in Yavatmal.",
      "hero.stageBody": "Exterior design intent · Build progress will be documented",
      "trust.localTitle": "Yavatmal focused",
      "trust.localBody": "Local enquiries and site visits",
      "trust.choiceTitle": "Your choice of scope",
      "trust.choiceBody": "With materials or without",
      "trust.quoteTitle": "Quote by requirement",
      "trust.quoteBody": "No one-size-fits-all price",
      "projects.demoKey": "Original photos and design visuals are labelled",
      "projects.promiseTitle": "One clear visual record",
      "projects.promiseBody": "Every real project can be organised by location, area, scope, status, and construction stage.",
      "projects.adminLink": "Owner dashboard",
      "services.enquire": "Enquire about this option",
      "services.getMaterialQuote": "Request a material quote",
      "comparison.label": "Not sure which option?",
      "comparison.title": "Compare before you decide.",
      "comparison.body": "The right model depends on your time, purchasing experience, and how much coordination you want to manage.",
      "comparison.cta": "Ask for guidance",
      "comparison.question": "Question",
      "comparison.with": "With materials",
      "comparison.without": "Without materials",
      "comparison.buying": "Who arranges materials?",
      "comparison.coord": "Day-to-day material coordination",
      "comparison.quoteBasis": "Quote is based on",
      "comparison.us": "We do",
      "comparison.you": "You do",
      "comparison.scopeSpecs": "Scope + specifications",
      "comparison.workScope": "Work + labour scope",
      "process.cta": "Start your project enquiry",
      "materials.deliveryBody": "Transport distance, access, quantity, and requested date can affect the quote.",
      "testimonials.emptyTitle": "Your first approved testimonial will appear here.",
      "testimonials.emptyBody": "The preview dashboard requires permission before any feedback is saved.",
      "forms.whatsappLabel": "WhatsApp option",
      "forms.whatsappValue": "Share your enquiry",
      "forms.serviceArea": "Service area",
      "forms.bags": "Bags",
      "forms.bricksUnit": "Bricks",
      "forms.tonnes": "Tonnes",
      "forms.loads": "Vehicle loads",
      "forms.whatsappReply": "I’m happy to continue this enquiry on WhatsApp",
      "forms.privacy": "No instant price promise — the quote depends on scope, specifications, and site details.",
      "forms.materialPrivacy": "Availability, specification, and delivery are confirmed before the final quote.",
      "footer.workingName": "Working name — availability still needs checking.",
      "footer.area": "Service area",
      "footer.phone": "Phone",
      "footer.phonePending": "Add before public launch",
      "footer.admin": "Preview dashboard ↗",
    },
    hi: {
      "topbar.note": "निजी प्रीव्यू · कामकाजी नाम कभी भी बदला जा सकता है",
      "hero.titleA": "आपका घर, बना हो",
      "hero.titleB": "एक मज़बूत बुनियाद पर।",
      "hero.imageLabel": "निर्माणाधीन प्रोजेक्ट · बाहरी डिज़ाइन दृश्य, पूर्ण काम नहीं",
      "hero.stageTitle": "नियोक्लासिकल निवास — यवतमाल में निर्माणाधीन।",
      "hero.stageBody": "बाहरी डिज़ाइन की परिकल्पना · निर्माण प्रगति दर्ज की जाएगी",
      "trust.localTitle": "यवतमाल पर केंद्रित",
      "trust.localBody": "स्थानीय पूछताछ और साइट विज़िट",
      "trust.choiceTitle": "काम का तरीका आपकी पसंद का",
      "trust.choiceBody": "सामग्री सहित या बिना सामग्री",
      "trust.quoteTitle": "ज़रूरत के अनुसार कोटेशन",
      "trust.quoteBody": "हर काम के लिए एक जैसी कीमत नहीं",
      "projects.demoKey": "तस्वीरें और डिज़ाइन दृश्य चिन्हित हैं",
      "projects.promiseTitle": "काम का एक स्पष्ट दृश्य रिकॉर्ड",
      "projects.promiseBody": "हर वास्तविक प्रोजेक्ट को स्थान, क्षेत्र, काम के दायरे, स्थिति और निर्माण चरण के अनुसार व्यवस्थित किया जा सकता है।",
      "projects.adminLink": "प्रीव्यू डैशबोर्ड खोलें",
      "services.enquire": "इस विकल्प के बारे में पूछें",
      "services.getMaterialQuote": "सामग्री का कोटेशन माँगें",
      "comparison.label": "कौन-सा विकल्प सही है, तय नहीं?",
      "comparison.title": "फैसले से पहले तुलना करें।",
      "comparison.body": "सही तरीका आपके समय, खरीद अनुभव और आप कितना समन्वय संभालना चाहते हैं, इस पर निर्भर करता है।",
      "comparison.cta": "मार्गदर्शन माँगें",
      "comparison.question": "सवाल",
      "comparison.with": "सामग्री सहित",
      "comparison.without": "बिना सामग्री",
      "comparison.buying": "सामग्री कौन खरीदेगा?",
      "comparison.coord": "सामग्री का रोज़ का समन्वय",
      "comparison.quoteBasis": "कोटेशन का आधार",
      "comparison.us": "हम",
      "comparison.you": "आप",
      "comparison.scopeSpecs": "काम का दायरा + विनिर्देश",
      "comparison.workScope": "काम + श्रम का दायरा",
      "process.cta": "अपने प्रोजेक्ट की पूछताछ शुरू करें",
      "materials.deliveryBody": "परिवहन दूरी, पहुँच, मात्रा और माँगी गई तारीख से कोटेशन प्रभावित हो सकता है।",
      "testimonials.emptyTitle": "पहली स्वीकृत ग्राहक प्रतिक्रिया यहाँ दिखाई देगी।",
      "testimonials.emptyBody": "प्रतिक्रिया सेव करने से पहले प्रीव्यू डैशबोर्ड में अनुमति आवश्यक है।",
      "forms.whatsappLabel": "WhatsApp विकल्प",
      "forms.whatsappValue": "अपनी पूछताछ साझा करें",
      "forms.serviceArea": "सेवा क्षेत्र",
      "forms.bags": "बैग",
      "forms.bricksUnit": "ईंट",
      "forms.tonnes": "टन",
      "forms.loads": "वाहन लोड",
      "forms.whatsappReply": "मैं WhatsApp पर यह बातचीत जारी रख सकता/सकती हूँ",
      "forms.privacy": "तुरंत कीमत का वादा नहीं — कोटेशन काम के दायरे, विनिर्देश और साइट विवरण पर निर्भर है।",
      "forms.materialPrivacy": "अंतिम कोटेशन से पहले उपलब्धता, विनिर्देश और डिलीवरी की पुष्टि की जाती है।",
      "footer.workingName": "कामकाजी नाम — उपलब्धता की जाँच अभी बाकी है।",
      "footer.area": "सेवा क्षेत्र",
      "footer.phone": "फोन",
      "footer.phonePending": "सार्वजनिक लॉन्च से पहले जोड़ें",
      "footer.admin": "प्रीव्यू डैशबोर्ड ↗",
    },
    mr: {
      "topbar.note": "खाजगी पूर्वदृश्य · कामकाजाचे नाव कधीही बदलता येईल",
      "hero.titleA": "तुमचे घर, उभे राहो",
      "hero.titleB": "एका मजबूत पायावर.",
      "hero.imageLabel": "बांधकाम सुरू असलेला प्रकल्प · बाह्य रचना दृश्य, पूर्ण झालेले काम नाही",
      "hero.stageTitle": "निओक्लासिकल निवास — यवतमाळमध्ये बांधकाम सुरू.",
      "hero.stageBody": "बाह्य रचनेची संकल्पना · बांधकामाची प्रगती नोंदवली जाईल",
      "trust.localTitle": "यवतमाळवर केंद्रित",
      "trust.localBody": "स्थानिक चौकशी आणि साइट भेटी",
      "trust.choiceTitle": "कामाची पद्धत तुमच्या पसंतीची",
      "trust.choiceBody": "साहित्यासह किंवा साहित्याविना",
      "trust.quoteTitle": "गरजेनुसार कोटेशन",
      "trust.quoteBody": "प्रत्येक कामासाठी एकच किंमत नाही",
      "projects.demoKey": "छायाचित्रे आणि रचना दृश्ये चिन्हांकित आहेत",
      "projects.promiseTitle": "कामाची एक स्पष्ट दृश्य नोंद",
      "projects.promiseBody": "प्रत्येक वास्तविक प्रकल्प ठिकाण, क्षेत्रफळ, कामाची व्याप्ती, स्थिती आणि बांधकाम टप्प्यानुसार मांडता येईल.",
      "projects.adminLink": "पूर्वदृश्य डॅशबोर्ड उघडा",
      "services.enquire": "या पर्यायाबद्दल चौकशी करा",
      "services.getMaterialQuote": "साहित्याचे कोटेशन मागवा",
      "comparison.label": "कोणता पर्याय योग्य हे ठरत नाही?",
      "comparison.title": "निर्णयापूर्वी तुलना करा.",
      "comparison.body": "योग्य पद्धत तुमचा वेळ, खरेदीचा अनुभव आणि किती समन्वय तुम्हाला सांभाळायचा आहे यावर अवलंबून असते.",
      "comparison.cta": "मार्गदर्शन मागा",
      "comparison.question": "प्रश्न",
      "comparison.with": "साहित्यासह",
      "comparison.without": "साहित्याविना",
      "comparison.buying": "साहित्य कोण आणेल?",
      "comparison.coord": "साहित्याचा दैनंदिन समन्वय",
      "comparison.quoteBasis": "कोटेशनचा आधार",
      "comparison.us": "आम्ही",
      "comparison.you": "तुम्ही",
      "comparison.scopeSpecs": "कामाची व्याप्ती + वैशिष्ट्ये",
      "comparison.workScope": "काम + मजूर व्याप्ती",
      "process.cta": "तुमच्या प्रकल्पाची चौकशी सुरू करा",
      "materials.deliveryBody": "वाहतूक अंतर, पोहोच, प्रमाण आणि मागितलेली तारीख यांमुळे कोटेशन बदलू शकते.",
      "testimonials.emptyTitle": "पहिला मंजूर ग्राहक अभिप्राय येथे दिसेल.",
      "testimonials.emptyBody": "अभिप्राय जतन करण्यापूर्वी पूर्वदृश्य डॅशबोर्डमध्ये परवानगी आवश्यक आहे.",
      "forms.whatsappLabel": "WhatsApp पर्याय",
      "forms.whatsappValue": "तुमची चौकशी शेअर करा",
      "forms.serviceArea": "सेवा क्षेत्र",
      "forms.bags": "पिशव्या",
      "forms.bricksUnit": "विटा",
      "forms.tonnes": "टन",
      "forms.loads": "वाहन लोड",
      "forms.whatsappReply": "ही चौकशी WhatsApp वर पुढे सुरू ठेवण्यास माझी हरकत नाही",
      "forms.privacy": "तत्काळ किंमतीचे आश्वासन नाही — कोटेशन व्याप्ती, वैशिष्ट्ये आणि साइटच्या माहितीनुसार ठरेल.",
      "forms.materialPrivacy": "अंतिम कोटेशनपूर्वी उपलब्धता, वैशिष्ट्ये आणि डिलिव्हरी निश्चित केली जाते.",
      "footer.workingName": "कामकाजाचे नाव — उपलब्धता अजून तपासायची आहे.",
      "footer.area": "सेवा क्षेत्र",
      "footer.phone": "फोन",
      "footer.phonePending": "सार्वजनिक लाँचपूर्वी जोडा",
      "footer.admin": "पूर्वदृश्य डॅशबोर्ड ↗",
    },
  };

  const TRANSLATION_ALIASES = {
    "a11y.skip": "skip.content",
    "topbar.location": "hero.local",
    "nav.menu": "menu.open",
    "hero.body": "hero.subtitle",
    "hero.ctaConstruction": "hero.primary",
    "hero.ctaMaterial": "hero.secondary",
    "hero.point1": "services.withMaterials.title",
    "hero.point2": "services.withoutMaterials.title",
    "hero.point3": "materials.confirm",
    "projects.body": "projects.intro",
    "projects.filterAll": "projects.filter.all",
    "projects.filterOngoing": "projects.filter.ongoing",
    "projects.filterCompleted": "projects.filter.completed",
    "services.body": "services.intro",
    "services.withTitle": "services.withMaterials.title",
    "services.withBody": "services.withMaterials.description",
    "services.withPoint1": "services.withMaterials.point1",
    "services.withPoint2": "services.withMaterials.point2",
    "services.withPoint3": "services.withMaterials.point3",
    "services.withoutTitle": "services.withoutMaterials.title",
    "services.withoutBody": "services.withoutMaterials.description",
    "services.withoutPoint1": "services.withoutMaterials.point1",
    "services.withoutPoint2": "services.withoutMaterials.point2",
    "services.withoutPoint3": "services.withoutMaterials.point3",
    "services.supplyTitle": "services.supply.title",
    "services.supplyBody": "services.supply.description",
    "services.supplyPoint1": "services.supply.point1",
    "services.supplyPoint2": "services.supply.point2",
    "services.supplyPoint3": "services.supply.point3",
    "process.body": "process.intro",
    "process.step1Title": "process.step1.title",
    "process.step1Body": "process.step1.description",
    "process.step2Title": "process.step2.title",
    "process.step2Body": "process.step2.description",
    "process.step3Title": "process.step3.title",
    "process.step3Body": "process.step3.description",
    "process.step4Title": "process.step4.title",
    "process.step4Body": "process.step4.description",
    "materials.body": "materials.intro",
    "materials.quoteStatus": "materials.available",
    "materials.sandTitle": "materials.sand.title",
    "materials.sandBody": "materials.sand.description",
    "materials.sandCta": "materials.quote",
    "materials.bricksTitle": "materials.bricks.title",
    "materials.bricksBody": "materials.bricks.description",
    "materials.bricksCta": "materials.quote",
    "materials.cementTitle": "materials.cement.title",
    "materials.cementBody": "materials.cement.description",
    "materials.cementCta": "materials.quote",
    "materials.deliveryTitle": "materials.confirm",
    "testimonials.body": "testimonials.intro",
    "forms.eyebrow": "quote.eyebrow",
    "forms.title": "quote.title",
    "forms.body": "quote.intro",
    "forms.constructionTab": "quote.tab.construction",
    "forms.materialTab": "quote.tab.material",
    "forms.mode": "forms.constructionType",
    "forms.choose": "forms.selectOption",
    "forms.prepareConstruction": "forms.submitConstruction",
    "forms.prepareMaterial": "forms.submitMaterial",
    "footer.body": "footer.about",
    "footer.explore": "footer.links",
    "footer.materials": "nav.materials",
    "mobile.project": "quote.tab.construction",
    "mobile.quote": "nav.quote",
  };

  const SHARED = JSON.parse(document.getElementById("site-content")?.textContent || "null");

  const DEFAULT_SETTINGS = {
    businessName: "Buniyaad Builders & Suppliers",
    phone: "",
    whatsapp: "",
    city: "Yavatmal",
  };

  const DEFAULT_PROJECTS = [
    {
      id: "ongoing-neoclassical-residence-yavatmal",
      demo: false,
      title: {
        en: "Neoclassical Residence — Under Construction",
        hi: "नियोक्लासिकल निवास — निर्माणाधीन",
        mr: "निओक्लासिकल निवास — बांधकाम सुरू",
      },
      location: {
        en: "Yavatmal",
        hi: "यवतमाल",
        mr: "यवतमाळ",
      },
      area: {
        en: "Area details to be added",
        hi: "क्षेत्रफल का विवरण जोड़ा जाना है",
        mr: "क्षेत्रफळाची माहिती जोडायची आहे",
      },
      scope: {
        en: "House construction · Scope details to be added",
        hi: "घर निर्माण · काम के दायरे का विवरण जोड़ा जाना है",
        mr: "घर बांधकाम · कामाच्या व्याप्तीची माहिती जोडायची आहे",
      },
      status: "ongoing",
      images: [
        {
          src: "assets/ongoing-neoclassical-front.webp",
          stage: "design",
          alt: {
            en: "Front exterior design visualisation for the proposed residence; not a photo of completed work",
            hi: "प्रस्तावित निवास का सामने से बाहरी डिज़ाइन दृश्य; यह पूर्ण काम की तस्वीर नहीं है",
            mr: "प्रस्तावित निवासाचे समोरील बाह्य रचना दृश्य; हे पूर्ण झालेल्या कामाचे छायाचित्र नाही",
          },
          caption: {
            en: "Front exterior design visualisation for the proposed residence — not completed work.",
            hi: "प्रस्तावित निवास का सामने से बाहरी डिज़ाइन दृश्य — यह पूर्ण काम नहीं है।",
            mr: "प्रस्तावित निवासाचे समोरील बाह्य रचना दृश्य — हे पूर्ण झालेले काम नाही.",
          },
        },
        {
          src: "assets/ongoing-neoclassical-angle.webp",
          stage: "design",
          alt: {
            en: "Angled exterior design visualisation for the proposed residence; not a photo of completed work",
            hi: "प्रस्तावित निवास का कोण से बाहरी डिज़ाइन दृश्य; यह पूर्ण काम की तस्वीर नहीं है",
            mr: "प्रस्तावित निवासाचे कोनातून बाह्य रचना दृश्य; हे पूर्ण झालेल्या कामाचे छायाचित्र नाही",
          },
          caption: {
            en: "Angled exterior design visualisation for the proposed residence — not completed work.",
            hi: "प्रस्तावित निवास का कोण से बाहरी डिज़ाइन दृश्य — यह पूर्ण काम नहीं है।",
            mr: "प्रस्तावित निवासाचे कोनातून बाह्य रचना दृश्य — हे पूर्ण झालेले काम नाही.",
          },
        },
        {
          src: "assets/ongoing-neoclassical-elevation.webp",
          stage: "design",
          alt: {
            en: "Exterior elevation design visualisation for the proposed residence; not a photo of completed work",
            hi: "प्रस्तावित निवास का बाहरी एलिवेशन डिज़ाइन दृश्य; यह पूर्ण काम की तस्वीर नहीं है",
            mr: "प्रस्तावित निवासाचे बाह्य एलिव्हेशन रचना दृश्य; हे पूर्ण झालेल्या कामाचे छायाचित्र नाही",
          },
          caption: {
            en: "Exterior elevation design visualisation for the proposed residence — not completed work.",
            hi: "प्रस्तावित निवास का बाहरी एलिवेशन डिज़ाइन दृश्य — यह पूर्ण काम नहीं है।",
            mr: "प्रस्तावित निवासाचे बाह्य एलिव्हेशन रचना दृश्य — हे पूर्ण झालेले काम नाही.",
          },
        },
      ],
    },

  ];

  const DEFAULT_MATERIALS = {
    sand: { available: true, note: "", updatedAt: null },
    bricks: { available: true, note: "", updatedAt: null },
    cement: { available: true, note: "", updatedAt: null },
  };

  const DEFAULT_TESTIMONIALS = [];

  let language = getInitialLanguage();
  let settings = readSettings();
  let projects = readProjects();
  let materials = readMaterials();
  let testimonials = readTestimonials();
  let activeFilter = "all";
  let galleryItems = [];
  let currentLightboxTrigger = null;
  let toastTimer = null;

  const reducedMotionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_error) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_error) {
      // The site remains usable when storage is blocked or full.
    }
  }

  function readJson(key, fallback) {
    const raw = safeStorageGet(key);
    if (!raw) return clone(fallback);
    try {
      const value = JSON.parse(raw);
      return value == null ? clone(fallback) : value;
    } catch (_error) {
      return clone(fallback);
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getInitialLanguage() {
    if (SHARED?.language) return SHARED.language;
    const stored = safeStorageGet(STORAGE_KEYS.language);
    if (SUPPORTED_LANGUAGES.includes(stored)) return stored;
    const browserLanguage = String(navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED_LANGUAGES.includes(browserLanguage) ? browserLanguage : "en";
  }

  function readSettings() {
    const stored = SHARED?.settings || {};
    return stored && typeof stored === "object" && !Array.isArray(stored)
      ? {
          ...DEFAULT_SETTINGS,
          ...stored,
          businessName: stored.businessName || stored.firmName || DEFAULT_SETTINGS.businessName,
          whatsapp: stored.whatsapp || stored.whatsappNumber || "",
        }
      : { ...DEFAULT_SETTINGS };
  }

  function readProjects() {
    return SHARED ? SHARED.projects : clone(DEFAULT_PROJECTS);
  }

  function readMaterials() {
    const stored = SHARED?.materials || DEFAULT_MATERIALS;
    const normalized = clone(DEFAULT_MATERIALS);

    if (Array.isArray(stored)) {
      stored.forEach((item) => {
        if (!item || typeof item !== "object") return;
        const key = materialKey(item.key || item.id || item.name || item.material);
        if (key) normalized[key] = { ...normalized[key], ...item };
      });
      return normalized;
    }

    if (stored && typeof stored === "object") {
      Object.keys(stored).forEach((rawKey) => {
        const key = materialKey(rawKey);
        if (!key) return;
        const value = stored[rawKey];
        normalized[key] =
          typeof value === "boolean"
            ? { ...normalized[key], available: value }
            : { ...normalized[key], ...(value || {}) };
      });
    }

    return normalized;
  }

  function readTestimonials() {
    const stored = SHARED?.testimonials || DEFAULT_TESTIMONIALS;
    return Array.isArray(stored) ? stored : [];
  }

  function t(key, variables) {
    const dictionary = TRANSLATIONS[language] || TRANSLATIONS.en;
    const pageDictionary = PAGE_TRANSLATIONS[language] || PAGE_TRANSLATIONS.en;
    const alias = TRANSLATION_ALIASES[key];
    const value =
      pageDictionary[key] ||
      dictionary[key] ||
      (alias && dictionary[alias]) ||
      PAGE_TRANSLATIONS.en[key] ||
      TRANSLATIONS.en[key] ||
      (alias && TRANSLATIONS.en[alias]) ||
      key;
    return interpolate(value, variables);
  }

  function interpolate(value, variables) {
    if (!variables) return String(value);
    return String(value).replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) =>
      Object.prototype.hasOwnProperty.call(variables, key) ? String(variables[key]) : match,
    );
  }

  function localized(value, fallback) {
    if (value == null || value === "") return fallback || "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (typeof value === "object") {
      return String(value[language] || value.en || value.hi || value.mr || fallback || "");
    }
    return fallback || "";
  }

  function canonical(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  function materialKey(value) {
    const key = canonical(value);
    if (["sand", "river-sand", "m-sand", "msand", "reti", "valu", "walu"].includes(key)) return "sand";
    if (["brick", "bricks", "red-bricks", "cement-bricks", "vit", "vita"].includes(key)) return "bricks";
    if (["cement", "cements"].includes(key)) return "cement";
    return "";
  }

  function stageKey(value) {
    const key = canonical(value);
    if (["foundation", "footing", "base"].includes(key)) return "foundation";
    if (["structure", "structural", "rcc", "frame", "slab"].includes(key)) return "structure";
    if (["brickwork", "brick-work", "masonry", "walls"].includes(key)) return "brickwork";
    if (["plaster", "plastering", "finishing"].includes(key)) return "plastering";
    if (["complete", "completed", "completion", "finished", "final"].includes(key)) return "completed";
    return key || "structure";
  }

  function statusKey(value) {
    const key = canonical(value);
    return ["complete", "completed", "finished", "done"].includes(key) ? "completed" : "ongoing";
  }

  function scopeLabel(value) {
    const key = canonical(value);
    if (["with-materials", "with-material", "materials-included", "turnkey"].includes(key)) {
      return t("scope.withMaterials");
    }
    if (["without-materials", "without-material", "labour", "labor", "labour-only", "labor-only"].includes(key)) {
      return t("scope.withoutMaterials");
    }
    if (["material-supply", "materials", "supply"].includes(key)) return t("scope.materialSupply");
    return localized(value, t("scope.withMaterials"));
  }

  function materialLabel(key) {
    return t(`materials.${materialKey(key) || key}.title`);
  }

  function applyTranslations(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const value = t(key);
      if (value === key) return;
      const textTarget = element.querySelector("[data-i18n-text]");
      if (textTarget) textTarget.textContent = value;
      else if (element instanceof HTMLInputElement && ["button", "submit", "reset"].includes(element.type)) {
        element.value = value;
      } else {
        element.textContent = value;
      }
    });

    scope.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.setAttribute("placeholder", t(element.getAttribute("data-i18n-placeholder")));
    });
    scope.querySelectorAll("[data-i18n-aria-label], [data-i18n-aria]").forEach((element) => {
      const key = element.getAttribute("data-i18n-aria-label") || element.getAttribute("data-i18n-aria");
      element.setAttribute("aria-label", t(key));
    });
    scope.querySelectorAll("[data-i18n-title]").forEach((element) => {
      element.setAttribute("title", t(element.getAttribute("data-i18n-title")));
    });
    scope.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      element.setAttribute("alt", t(element.getAttribute("data-i18n-alt")));
    });
  }

  function setLanguage(nextLanguage, persist) {
    language = SUPPORTED_LANGUAGES.includes(nextLanguage) ? nextLanguage : "en";
    document.documentElement.lang = language;
    if (persist !== false) safeStorageSet(STORAGE_KEYS.language, language);

    document.querySelectorAll("[data-lang]").forEach((button) => {
      const isActive = button.getAttribute("data-lang") === language;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    applyTranslations(document);
    updateMenuAccessibility();
    renderProjects();
    renderMaterials();
    renderTestimonials();
    updateContactLinks();
    document.dispatchEvent(new CustomEvent("buniyaad:languagechange", { detail: { language } }));
  }

  function initLanguageButtons() {
    document.querySelectorAll("[data-lang]").forEach((button) => {
      if (button.tagName === "BUTTON" && !button.hasAttribute("type")) button.setAttribute("type", "button");
      button.addEventListener("click", () => setLanguage(button.getAttribute("data-lang")));
    });
  }

  function initMobileNavigation() {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("siteNav");
    if (!toggle || !nav) return;

    toggle.setAttribute("aria-controls", nav.id);
    toggle.setAttribute("aria-expanded", "false");
    updateMenuAccessibility();

    toggle.addEventListener("click", () => {
      const willOpen = toggle.getAttribute("aria-expanded") !== "true";
      setMenuOpen(willOpen);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenuOpen(false, false);
    });

    document.addEventListener("click", (event) => {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (!nav.contains(event.target) && !toggle.contains(event.target)) setMenuOpen(false, false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false, true);
      }
    });

    if (window.matchMedia) {
      const mobileQuery = window.matchMedia("(max-width: 767px)");
      const syncMenu = () => {
        if (!mobileQuery.matches) setMenuOpen(false, false);
        updateMenuAccessibility();
      };
      if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", syncMenu);
      else if (mobileQuery.addListener) mobileQuery.addListener(syncMenu);
    }
  }

  function setMenuOpen(isOpen, returnFocus) {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("siteNav");
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.classList.toggle("is-active", isOpen);
    nav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    updateMenuAccessibility();
    if (!isOpen && returnFocus) toggle.focus();
  }

  function updateMenuAccessibility() {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("siteNav");
    if (!toggle || !nav) return;
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    const isMobile = window.matchMedia ? window.matchMedia("(max-width: 767px)").matches : true;
    toggle.setAttribute("aria-label", t(isOpen ? "menu.close" : "menu.open"));
    if (isMobile) {
      nav.setAttribute("aria-hidden", String(!isOpen));
      if ("inert" in nav) nav.inert = !isOpen;
    } else {
      nav.removeAttribute("aria-hidden");
      if ("inert" in nav) nav.inert = false;
    }
  }

  function normalizeProjectImages(project) {
    const source = project.images || project.photos || project.media || project.stages || [];
    let images = [];

    if (Array.isArray(source)) {
      images = source;
    } else if (source && typeof source === "object") {
      images = Object.keys(source).flatMap((stage) => {
        const value = source[stage];
        const list = Array.isArray(value) ? value : [value];
        return list.map((item) =>
          typeof item === "string" ? { src: item, stage } : { ...(item || {}), stage: item.stage || stage },
        );
      });
    }

    if (!images.length && (project.image || project.imageUrl || project.cover)) {
      images = [{ src: project.image || project.imageUrl || project.cover, stage: project.stage || project.status }];
    }

    return images
      .map((image, index) => {
        if (typeof image === "string") return { src: image, stage: index === images.length - 1 ? "completed" : "structure" };
        return {
          ...image,
          src: image.src || image.url || image.dataUrl || image.path || "",
          stage: stageKey(image.stage || image.phase || image.type || project.stage),
        };
      })
      .filter((image) => image.src && !/^javascript:/i.test(String(image.src).trim()));
  }

  function renderProjects() {
    if (SHARED) return; // Published cards and project URLs are rendered by the server.
    const grid = document.getElementById("projectGrid");
    if (!grid) return;
    grid.replaceChildren();
    galleryItems = [];

    projects.forEach((project, projectIndex) => {
      if (!project || typeof project !== "object") return;
      const projectTitle = localized(project.title || project.name || project.projectName, t("projects.sample.title"));
      const location = localized(project.location || project.siteLocation, t("contact.location"));
      const area = localized(project.area || project.builtUpArea || project.plotArea, "");
      const scope = scopeLabel(project.scope || project.mode || project.work || project.service || "with-materials");
      const status = statusKey(project.status);
      const isDemo = project.demo === true;

      normalizeProjectImages(project).forEach((photo, photoIndex) => {
        const stage = stageKey(photo.stage);
        const stageLabel = t(`stage.${stage}`);
        const item = {
          src: photo.src,
          alt: localized(photo.alt, `${projectTitle} — ${stageLabel}`),
          caption: localized(photo.caption, `${projectTitle} — ${stageLabel}`),
          projectTitle,
          stage,
          stageLabel,
          location,
          trigger: null,
        };
        const galleryIndex = galleryItems.push(item) - 1;

        const card = document.createElement("article");
        card.className = "project-card";
        card.dataset.filterTags = ["all", status, stage].join(" ");
        card.dataset.projectId = String(project.id || `project-${projectIndex + 1}`);

        const media = document.createElement("div");
        media.className = "project-card__media";
        const mediaButton = document.createElement("button");
        mediaButton.type = "button";
        mediaButton.className = "project-card__open";
        mediaButton.dataset.lightbox = String(galleryIndex);
        mediaButton.setAttribute(
          "aria-label",
          t("projects.viewPhoto", { stage: stageLabel, project: projectTitle }),
        );

        const image = document.createElement("img");
        image.src = photo.src;
        image.alt = item.alt;
        image.loading = photoIndex === 0 && projectIndex === 0 ? "eager" : "lazy";
        image.decoding = "async";
        mediaButton.appendChild(image);

        if (isDemo) {
          const demoChip = document.createElement("span");
          demoChip.className = "demo-badge";
          demoChip.textContent = t("projects.demoBadge");
          mediaButton.appendChild(demoChip);
        }
        const statusChip = document.createElement("span");
        statusChip.className = "project-status";
        statusChip.textContent = t(`status.${status}`);
        mediaButton.appendChild(statusChip);
        media.appendChild(mediaButton);
        card.appendChild(media);

        const body = document.createElement("div");
        body.className = "project-card__body";
        const title = document.createElement("h3");
        title.textContent = projectTitle;
        body.appendChild(title);

        const stageList = document.createElement("div");
        stageList.className = "stage-chips";
        const stageChip = document.createElement("span");
        stageChip.className = "stage-chip";
        stageChip.textContent = stageLabel;
        stageList.appendChild(stageChip);
        body.appendChild(stageList);

        const meta = document.createElement("div");
        meta.className = "project-card__meta project-meta";
        appendMeta(meta, t("projects.location"), location);
        if (area) appendMeta(meta, t("projects.area"), area);
        appendMeta(meta, t("projects.scope"), scope);
        appendMeta(meta, t("projects.status"), t(`status.${status}`));
        body.appendChild(meta);
        card.appendChild(body);
        grid.appendChild(card);

        item.trigger = mediaButton;
      });
    });

    let empty = document.querySelector("[data-project-empty]");
    if (!empty) {
      empty = document.createElement("p");
      empty.dataset.projectEmpty = "";
      empty.className = "project-empty";
      empty.setAttribute("role", "status");
      grid.insertAdjacentElement("afterend", empty);
    }
    empty.textContent = t("projects.empty");

    applyProjectFilter(activeFilter);
  }

  function appendMeta(list, label, value) {
    const wrapper = document.createElement("span");
    wrapper.textContent = `${label}: ${value}`;
    list.appendChild(wrapper);
  }

  function initGallery() {
    document.addEventListener("click", (event) => {
      const filterButton = event.target.closest("[data-filter]");
      if (filterButton) {
        event.preventDefault();
        activeFilter = canonical(filterButton.getAttribute("data-filter")) || "all";
        if (["all-stages", "all-projects", "projects"].includes(activeFilter)) activeFilter = "all";
        applyProjectFilter(activeFilter);
        return;
      }

      const lightboxButton = event.target.closest("[data-lightbox]");
      if (lightboxButton) {
        const index = Number(lightboxButton.getAttribute("data-lightbox"));
        if (Number.isFinite(index) && galleryItems[index]) openLightbox(galleryItems[index], lightboxButton);
      }
    });

    const lightbox = document.getElementById("lightbox");
    const closeButton = document.getElementById("lightboxClose");
    if (!lightbox) return;

    lightbox.setAttribute("role", lightbox.getAttribute("role") || "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-hidden", "true");
    if (closeButton) {
      closeButton.setAttribute("aria-label", t("lightbox.close"));
      closeButton.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target.closest("[data-lightbox-dismiss]")) closeLightbox();
    });
    lightbox.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeLightbox();
    });
    document.addEventListener("keydown", handleLightboxKeydown);
  }

  function applyProjectFilter(filter) {
    const cards = Array.from(document.querySelectorAll("#projectGrid .project-card"));
    let visibleCount = 0;
    cards.forEach((card) => {
      const tags = String(card.dataset.filterTags || "").split(/\s+/);
      const isVisible = filter === "all" || tags.includes(filter);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    document.querySelectorAll("[data-filter]").forEach((button) => {
      let buttonFilter = canonical(button.getAttribute("data-filter")) || "all";
      if (["all-stages", "all-projects", "projects"].includes(buttonFilter)) buttonFilter = "all";
      const isActive = buttonFilter === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
      if (button.tagName === "BUTTON" && !button.hasAttribute("type")) button.setAttribute("type", "button");
    });

    const empty = document.querySelector("[data-project-empty]");
    if (empty) empty.hidden = visibleCount > 0;
  }

  function openLightbox(item, trigger) {
    const lightbox = document.getElementById("lightbox");
    const image = document.getElementById("lightboxImage");
    const caption = document.getElementById("lightboxCaption");
    const closeButton = document.getElementById("lightboxClose");
    if (!lightbox || !image || !caption) return;

    currentLightboxTrigger = trigger;
    image.src = item.src;
    image.alt = item.alt;
    caption.textContent = item.caption;
    lightbox.hidden = false;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");

    if (typeof lightbox.showModal === "function" && !lightbox.open) lightbox.showModal();
    window.requestAnimationFrame(() => (closeButton || lightbox).focus());
  }

  function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox || lightbox.getAttribute("aria-hidden") === "true") return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    if (typeof lightbox.close === "function" && lightbox.open) lightbox.close();
    lightbox.hidden = true;
    const returnTarget = currentLightboxTrigger;
    currentLightboxTrigger = null;
    if (returnTarget && document.contains(returnTarget)) returnTarget.focus();
  }

  function handleLightboxKeydown(event) {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox || lightbox.getAttribute("aria-hidden") === "true") return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveLightbox(event.key === "ArrowRight" ? 1 : -1);
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      lightbox.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
    if (!focusable.length) {
      event.preventDefault();
      lightbox.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function moveLightbox(direction) {
    const visibleTriggers = galleryItems
      .map((item) => item.trigger)
      .filter((trigger) => trigger && !trigger.closest(".project-card").hidden);
    if (!visibleTriggers.length) return;
    let index = visibleTriggers.indexOf(currentLightboxTrigger);
    if (index < 0) index = 0;
    index = (index + direction + visibleTriggers.length) % visibleTriggers.length;
    const trigger = visibleTriggers[index];
    const item = galleryItems[Number(trigger.dataset.lightbox)];
    if (item) openLightbox(item, trigger);
  }

  function initQuoteTabs() {
    const tabs = Array.from(document.querySelectorAll("[data-quote-tab]"));
    if (!tabs.length) return;
    const tablist = tabs[0].parentElement;
    if (tablist && !tablist.hasAttribute("role")) tablist.setAttribute("role", "tablist");

    tabs.forEach((tab, index) => {
      if (tab.tagName === "BUTTON" && !tab.hasAttribute("type")) tab.setAttribute("type", "button");
      tab.setAttribute("role", "tab");
      const targetName = quoteTabName(tab.getAttribute("data-quote-tab"));
      const panel = document.getElementById(targetName === "material" ? "materialForm" : "constructionForm");
      if (!tab.id) tab.id = `quote-tab-${targetName}`;
      if (panel) {
        tab.setAttribute("aria-controls", panel.id);
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", tab.id);
      }
      tab.addEventListener("click", () => activateQuoteTab(targetName, true));
      tab.addEventListener("keydown", (event) => {
        let nextIndex = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        if (nextIndex == null) return;
        event.preventDefault();
        tabs[nextIndex].focus();
        activateQuoteTab(quoteTabName(tabs[nextIndex].getAttribute("data-quote-tab")), true);
      });
    });

    const initiallySelected = tabs.find((tab) => tab.getAttribute("aria-selected") === "true" || tab.classList.contains("is-active"));
    activateQuoteTab(quoteTabName(initiallySelected ? initiallySelected.getAttribute("data-quote-tab") : "construction"), false);

    document.addEventListener("click", (event) => {
      const link = event.target.closest("[data-quote-link]");
      if (!link) return;
      event.preventDefault();
      const name = quoteTabName(link.getAttribute("data-quote-link"));
      activateQuoteTab(name, false);
      if (name === "construction" && link.hasAttribute("data-mode")) {
        const form = getForm(document.getElementById("constructionForm"));
        const modeField = findField(form, ["mode", "constructionType", "service", "projectType"]);
        if (modeField) {
          modeField.value = link.getAttribute("data-mode") || "";
          modeField.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
      const quoteSection = document.querySelector("[data-quote-section], #quote, #request-quote");
      if (quoteSection) quoteSection.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      const panel = document.getElementById(name === "material" ? "materialForm" : "constructionForm");
      const firstField = panel && panel.querySelector("input, select, textarea");
      if (firstField) window.setTimeout(() => firstField.focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 350);
    });
  }

  function quoteTabName(value) {
    const key = canonical(value);
    return key.includes("material") ? "material" : "construction";
  }

  function activateQuoteTab(name, focusPanel) {
    const activeName = name === "material" ? "material" : "construction";
    document.querySelectorAll("[data-quote-tab]").forEach((tab) => {
      const isActive = quoteTabName(tab.getAttribute("data-quote-tab")) === activeName;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
    });
    ["construction", "material"].forEach((panelName) => {
      const panel = document.getElementById(panelName === "material" ? "materialForm" : "constructionForm");
      if (!panel) return;
      const isActive = panelName === activeName;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
    if (focusPanel) {
      const panel = document.getElementById(activeName === "material" ? "materialForm" : "constructionForm");
      const firstField = panel && panel.querySelector("input, select, textarea, button");
      if (firstField) window.requestAnimationFrame(() => firstField.focus({ preventScroll: true }));
    }
  }

  function initMaterialButtons() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-material], [data-material-key], [data-material-enquire]");
      if (!button || button.closest("#materialForm") && ["OPTION", "INPUT"].includes(button.tagName)) return;
      const raw =
        button.getAttribute("data-material") ||
        button.getAttribute("data-material-key") ||
        button.getAttribute("data-material-enquire");
      const key = materialKey(raw);
      if (!key) return;
      event.preventDefault();
      preselectMaterial(key);
    });
  }

  function preselectMaterial(key) {
    activateQuoteTab("material", false);
    const panel = document.getElementById("materialForm");
    if (!panel) return;
    const form = getForm(panel);
    const field = findField(form, ["material", "materialType", "item", "product"]);
    if (field) {
      if (field instanceof HTMLSelectElement) {
        const option = Array.from(field.options).find((candidate) => {
          const candidateKey = materialKey(candidate.value) || materialKey(candidate.textContent);
          return candidateKey === key;
        });
        if (option) field.value = option.value;
        else field.value = key;
      } else {
        field.value = materialLabel(key);
      }
      field.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const target = document.querySelector("[data-quote-section], #quote, #request-quote") || panel;
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    if (field) window.setTimeout(() => field.focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 350);
    showToast(t("forms.materialSelected", { material: materialLabel(key) }));
  }

  function renderMaterials() {
    const materialKeys = ["sand", "bricks", "cement"];
    const grid = document.getElementById("materialGrid");
    if (grid && !grid.children.length) {
      materialKeys.forEach((key) => grid.appendChild(createMaterialCard(key, materials[key])));
    }

    document.querySelectorAll("[data-material-card]").forEach((card) => {
      const key = materialKey(card.getAttribute("data-material-card"));
      if (!key || !materials[key]) return;
      updateMaterialCard(card, key, materials[key]);
    });

    document.querySelectorAll("[data-material-status]").forEach((statusElement) => {
      const owner = statusElement.closest("[data-material-card]");
      const key = materialKey(statusElement.getAttribute("data-material-status") || (owner && owner.getAttribute("data-material-card")));
      if (!key || !materials[key]) return;
      statusElement.textContent = materials[key].available === false ? t("materials.unavailable") : t("materials.available");
      statusElement.classList.toggle("is-unavailable", materials[key].available === false);
    });
  }

  function createMaterialCard(key, data) {
    const card = document.createElement("article");
    card.className = "material-card";
    card.dataset.materialCard = key;
    const title = document.createElement("h3");
    title.className = "material-card__title";
    const description = document.createElement("p");
    description.className = "material-card__description";
    const status = document.createElement("p");
    status.className = "material-card__status";
    status.dataset.materialStatus = key;
    const note = document.createElement("p");
    note.className = "material-card__note";
    note.dataset.materialNote = "";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button button--secondary material-card__button";
    button.dataset.material = key;
    card.append(title, description, status, note, button);
    updateMaterialCard(card, key, data);
    return card;
  }

  function updateMaterialCard(card, key, data) {
    const title = card.querySelector(".material-card__title, [data-material-title]");
    const description = card.querySelector(".material-card__description, [data-material-description]");
    const status = card.querySelector("[data-material-status]");
    const note = card.querySelector("[data-material-note]");
    const button = card.querySelector("[data-material], [data-material-enquire]");
    if (title) title.textContent = materialLabel(key);
    if (description) description.textContent = t(`materials.${key}.description`);
    if (status) {
      status.textContent = data.available === false ? t("materials.unavailable") : t("materials.available");
      status.classList.toggle("is-unavailable", data.available === false);
    }
    if (note) {
      const noteText = localized(data.note, t("materials.confirm"));
      const updatedText = data.updatedAt ? formatUpdatedDate(data.updatedAt) : "";
      note.textContent = [noteText || t("materials.confirm"), updatedText].filter(Boolean).join(" · ");
    }
    if (button) {
      button.setAttribute("data-material", key);
      const textTarget = button.querySelector("[data-i18n-text], [data-i18n]");
      if (textTarget) textTarget.textContent = t("materials.quote");
      else button.textContent = t("materials.quote");
      button.setAttribute("aria-label", `${t("materials.quote")}: ${materialLabel(key)}`);
    }
  }

  function formatUpdatedDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return t("materials.updated", {
      date: new Intl.DateTimeFormat(LOCALES[language], { dateStyle: "medium" }).format(date),
    });
  }

  function renderTestimonials() {
    const grid = document.getElementById("testimonialGrid") || document.getElementById("testimonialList");
    if (!grid) return;
    grid.replaceChildren();
    const approved = testimonials.filter(
      (item) => item && typeof item === "object" && item.permission === true && localized(item.quote).trim(),
    );

    if (!approved.length) {
      grid.classList.remove("testimonial-grid");
      const empty = document.createElement("div");
      empty.className = "testimonial-empty";
      const mark = document.createElement("span");
      mark.className = "quote-mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = "“";
      const copy = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = t("testimonials.emptyTitle");
      const body = document.createElement("p");
      body.textContent = t("testimonials.emptyBody");
      copy.append(title, body);
      empty.append(mark, copy);
      grid.appendChild(empty);
      return;
    }

    grid.classList.add("testimonial-grid");
    approved.forEach((item) => {
      const card = document.createElement("figure");
      card.className = "testimonial-card";
      const quote = document.createElement("blockquote");
      quote.textContent = localized(item.quote);
      const caption = document.createElement("figcaption");
      const name = document.createElement("strong");
      name.textContent = localized(item.name, "Customer");
      caption.appendChild(name);
      const location = localized(item.location);
      if (location) {
        const place = document.createElement("small");
        place.textContent = location;
        caption.appendChild(place);
      }
      card.append(quote, caption);
      grid.appendChild(card);
    });
  }

  function getForm(panelOrForm) {
    if (!panelOrForm) return null;
    return panelOrForm.matches("form") ? panelOrForm : panelOrForm.querySelector("form");
  }

  function findField(form, names) {
    if (!form) return null;
    for (const name of names) {
      const field = form.querySelector(`[name="${name}"], #${name}, [data-field="${name}"]`);
      if (field) return field;
    }
    return null;
  }

  function fieldValue(form, names) {
    const field = findField(form, names);
    if (!field) return "";
    if ((field.type === "checkbox" || field.type === "radio") && !field.checked) {
      const checked = form.querySelector(`[name="${field.name}"]:checked`);
      return checked ? String(checked.value || "").trim() : "";
    }
    return String(field.value || "").trim();
  }

  function displayFieldValue(form, names) {
    const field = findField(form, names);
    if (!field) return "";
    if (field instanceof HTMLSelectElement && field.selectedIndex >= 0) {
      const option = field.options[field.selectedIndex];
      return option && option.value ? String(option.textContent || option.value).trim() : "";
    }
    return fieldValue(form, names);
  }

  function initForms() {
    const construction = getForm(document.getElementById("constructionForm"));
    const material = getForm(document.getElementById("materialForm"));
    if (construction) construction.addEventListener("submit", (event) => handleFormSubmit(event, "construction"));
    if (material) material.addEventListener("submit", (event) => handleFormSubmit(event, "material"));

    [construction, material].filter(Boolean).forEach((form) => {
      form.addEventListener("input", (event) => {
        if (event.target.matches("input, select, textarea")) event.target.removeAttribute("aria-invalid");
      });
    });
  }

  function handleFormSubmit(event, type) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validateForm(form, type)) return;
    const message = type === "material" ? buildMaterialMessage(form) : buildConstructionMessage(form);
    const url = buildWhatsAppUrl(message);
    if (!url) { showToast("Contact details are not configured yet. Please check back shortly.", "error"); return; }
    showToast(t("forms.openingWhatsapp"));
    openExternal(url);
  }

  function validateForm(form, type) {
    const requiredNames =
      type === "material"
        ? [
            ["name", "customerName", "fullName", "materialName"],
            ["phone", "mobile", "phoneNumber", "materialPhone"],
            ["material", "materialType", "item", "product"],
            ["quantity", "requiredQuantity", "materialQuantity"],
            ["deliveryLocation", "location", "address", "materialLocation"],
          ]
        : [
            ["name", "customerName", "fullName", "constructionName"],
            ["phone", "mobile", "phoneNumber", "constructionPhone"],
            ["plotLocation", "location", "siteLocation", "constructionLocation"],
            ["constructionType", "service", "projectType", "materialsOption", "mode"],
          ];

    let firstInvalid = null;
    requiredNames.forEach((aliases) => {
      const field = findField(form, aliases);
      if (!field || fieldValue(form, aliases)) return;
      field.setAttribute("aria-invalid", "true");
      if (!firstInvalid) firstInvalid = field;
    });

    if (typeof form.checkValidity === "function" && !form.checkValidity()) {
      if (typeof form.reportValidity === "function") form.reportValidity();
      if (!firstInvalid) firstInvalid = form.querySelector(":invalid");
    }

    const phoneAliases = type === "material"
      ? ["phone", "mobile", "phoneNumber", "materialPhone"]
      : ["phone", "mobile", "phoneNumber", "constructionPhone"];
    const phoneField = findField(form, phoneAliases);
    const phoneDigits = fieldValue(form, phoneAliases).replace(/\D/g, "");
    if (phoneField && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
      phoneField.setAttribute("aria-invalid", "true");
      firstInvalid = firstInvalid || phoneField;
      showToast(t("forms.invalidPhone"), "error");
      firstInvalid.focus();
      return false;
    }

    if (firstInvalid) {
      showToast(t("forms.invalid"), "error");
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  function buildConstructionMessage(form) {
    const values = {
      name: fieldValue(form, ["name", "customerName", "fullName", "constructionName"]),
      phone: fieldValue(form, ["phone", "mobile", "phoneNumber", "constructionPhone"]),
      location: fieldValue(form, ["plotLocation", "location", "siteLocation", "constructionLocation"]),
      area: fieldValue(form, ["area", "plotArea", "builtUpArea", "approximateArea"]),
      type: displayFieldValue(form, ["constructionType", "service", "projectType", "materialsOption", "mode"]),
      startDate: formatFormDate(fieldValue(form, ["startDate", "expectedStart", "expectedStartDate"])),
      notes: fieldValue(form, ["notes", "message", "details", "requirements"]),
    };
    if (values.area && /^\d+(?:\.\d+)?$/.test(values.area)) values.area = `${values.area} sq ft`;
    return buildMessage("message.constructionTitle", [
      ["message.name", values.name],
      ["message.phone", values.phone],
      ["message.location", values.location],
      ["message.area", values.area],
      ["message.constructionType", values.type],
      ["message.startDate", values.startDate],
      ["message.notes", values.notes],
    ]);
  }

  function buildMaterialMessage(form) {
    const rawMaterial = fieldValue(form, ["material", "materialType", "item", "product"]);
    const selectedMaterial = materialKey(rawMaterial)
      ? materialLabel(materialKey(rawMaterial))
      : displayFieldValue(form, ["material", "materialType", "item", "product"]);
    const quantity = fieldValue(form, ["quantity", "requiredQuantity", "materialQuantity"]);
    const unit = displayFieldValue(form, ["unit", "quantityUnit"]);
    const values = {
      name: fieldValue(form, ["name", "customerName", "fullName", "materialName"]),
      phone: fieldValue(form, ["phone", "mobile", "phoneNumber", "materialPhone"]),
      material: selectedMaterial,
      quantity: [quantity, unit].filter(Boolean).join(" "),
      location: fieldValue(form, ["deliveryLocation", "location", "address", "materialLocation"]),
      date: formatFormDate(fieldValue(form, ["deliveryDate", "requiredDate", "date"])),
      notes: fieldValue(form, ["notes", "message", "details", "requirements"]),
    };
    return buildMessage("message.materialTitle", [
      ["message.name", values.name],
      ["message.phone", values.phone],
      ["message.material", values.material],
      ["message.quantity", values.quantity],
      ["message.deliveryLocation", values.location],
      ["message.deliveryDate", values.date],
      ["message.notes", values.notes],
    ]);
  }

  function buildMessage(titleKey, rows) {
    const title = t(titleKey, { business: settings.businessName || t("site.name") });
    const details = rows.filter((row) => row[1]).map((row) => `${t(row[0])}: ${row[1]}`);
    return [title, "", ...details].join("\n");
  }

  function formatFormDate(value) {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(LOCALES[language], { dateStyle: "medium" }).format(date);
  }

  function normalizeWhatsAppNumber(value) {
    let digits = String(value || "").replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("0")) digits = `91${digits.slice(1)}`;
    else if (digits.length === 10) digits = `91${digits}`;
    return digits;
  }

  function buildWhatsAppUrl(message) {
    const number = normalizeWhatsAppNumber(settings.whatsapp);
    if (!number) return null;
    const base = `https://wa.me/${number}`;
    return `${base}?text=${encodeURIComponent(message)}`;
  }

  function openExternal(url) {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function updateContactLinks() {
    const generalMessage = t("message.general", { business: settings.businessName || t("site.name") });
    document.querySelectorAll("[data-whatsapp]").forEach((link) => {
      const customKey = link.getAttribute("data-whatsapp-message");
      const message = customKey && (TRANSLATIONS[language][customKey] || TRANSLATIONS.en[customKey])
        ? t(customKey, { business: settings.businessName || t("site.name") })
        : generalMessage;
      const url = buildWhatsAppUrl(message);
      if (!url) { link.removeAttribute("href"); link.setAttribute("aria-disabled", "true"); link.title = "WhatsApp number will be added before launch"; return; }
      link.removeAttribute("aria-disabled");
      link.setAttribute("href", url);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    document.querySelectorAll("[data-phone], [data-phone-display]").forEach((element) => {
      const phone = String(settings.phone || "").trim();
      if (element.tagName === "A") {
        if (phone) element.setAttribute("href", `tel:${phone.replace(/[^+\d]/g, "")}`);
        else element.removeAttribute("href");
      }
      if (phone && !element.hasAttribute("data-preserve-text")) element.textContent = phone;
      else if (!phone && element.hasAttribute("data-phone-display")) element.textContent = t("footer.phonePending");
    });
    document.querySelectorAll("[data-business-name]").forEach((element) => {
      element.textContent = settings.businessName || t("site.name");
    });
    document.querySelectorAll("[data-year]").forEach((element) => {
      element.textContent = String(new Date().getFullYear());
    });
    const currentYear = document.getElementById("currentYear");
    if (currentYear) currentYear.textContent = String(new Date().getFullYear());
  }

  function showToast(message, type) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    toast.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
    toast.classList.toggle("is-error", type === "error");
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => {
        toast.hidden = true;
      }, prefersReducedMotion() ? 0 : 200);
    }, 3800);
  }

  function prefersReducedMotion() {
    return Boolean(reducedMotionQuery && reducedMotionQuery.matches);
  }

  function syncReducedMotion() {
    document.documentElement.classList.toggle("reduce-motion", prefersReducedMotion());
  }

  function refreshFromStorage() {
    settings = readSettings();
    projects = readProjects();
    materials = readMaterials();
    testimonials = readTestimonials();
    renderProjects();
    renderMaterials();
    renderTestimonials();
    updateContactLinks();
  }

  function initStorageSync() {
    if (SHARED) return;
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEYS.language && SUPPORTED_LANGUAGES.includes(event.newValue)) {
        setLanguage(event.newValue, false);
        return;
      }
      if ([STORAGE_KEYS.projects, STORAGE_KEYS.settings, STORAGE_KEYS.materials, STORAGE_KEYS.testimonials].includes(event.key)) {
        refreshFromStorage();
      }
    });
  }

  function init() {
    document.documentElement.lang = language;
    syncReducedMotion();
    if (reducedMotionQuery) {
      if (reducedMotionQuery.addEventListener) reducedMotionQuery.addEventListener("change", syncReducedMotion);
      else if (reducedMotionQuery.addListener) reducedMotionQuery.addListener(syncReducedMotion);
    }
    initLanguageButtons();
    initMobileNavigation();
    initGallery();
    initQuoteTabs();
    initMaterialButtons();
    initForms();
    initStorageSync();
    setLanguage(language, false);
    if (SHARED) document.querySelectorAll("[data-phone-display]").forEach(el => el.removeAttribute("data-i18n"));
  }

  window.BuniyaadSite = {
    refresh: refreshFromStorage,
    setLanguage,
    getLanguage: () => language,
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
