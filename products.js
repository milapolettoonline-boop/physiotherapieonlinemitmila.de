const products = [

    {
        id: 1,
        name: "DH FitLife Balance Ball",
        category: "Fitness & Training",
        image: "images/balance.webp",
        page: "dh-fitlife-balance-ball.html",
        amazon: "https://amzn.to/4zeu9AC",

        shortDescription:
            "Balance Ball für Gleichgewicht, funktionelles Training und vielseitige Übungen zu Hause.",

        recommendation:
            "Eine interessante Möglichkeit für Gleichgewichtsübungen, funktionelles Training und abwechslungsreiche Bewegung im Alltag."
    },

    {
        id: 2,
        name: "Lenovo Yoga 7 2-in-1",
        category: "Technik",
        image: "images/lenovo.webp",
        page: "lenovo-yoga7.html",
        amazon: "https://amzn.to/3TCRHPe",

        shortDescription:
            "2-in-1 Laptop mit 16 Zoll 2.8K OLED Touch Display, AMD Ryzen AI 7, 16 GB RAM und 1 TB SSD.",

        recommendation:
            "Für Homeoffice und digitales Arbeiten ist ein guter Arbeitsplatz ein wichtiger Bestandteil eines ergonomischen Alltags."
    },

    {
        id: 3,
        name: "Mediflow Original Wasserkissen 5231",
        category: "Schlaf & Ergonomie",
        image: "images/wasserkissen.webp",
        page: "mediflow-wasserkissen.html",
        amazon: "https://amzn.to/3RQ55ig",

        shortDescription:
            "Wasserkissen mit L4-Luxusschonbezug im Kombipack, Größe 40 x 80 cm.",

        recommendation:
            "Ein individuell anpassbares Kissen kann eine interessante Ergänzung für Menschen sein, die auf eine angenehme Schlafposition achten."
    },

    {
        id: 4,
        name: "Beurer EM 49 Digital TENS/EMS",
        category: "Therapie",
        image: "images/Beurer.webp",
        page: "beurer-em49.html",
        amazon: "https://amzn.to/4fTMpq8",

        shortDescription:
            "TENS- und EMS-Gerät zur Schmerzlinderung, Muskelstimulation und Massage.",

        recommendation:
            "Ich empfehle dieses Gerät als mögliche Ergänzung zur physiotherapeutischen Behandlung bei geeigneten Beschwerden."
    },

    {
        id: 5,
        name: "PRO2 Lymphdrainage Gerät Beine",
        category: "Lymphdrainage",
        image: "images/Venen.webp",
        page: "pro2-lymphdrainage.html",
        amazon: "https://amzn.to/4clOTwd",

        shortDescription:
            "Beinmassagegerät für die unterstützende Anwendung bei schweren Beinen und zur Förderung der Durchblutung.",

        recommendation:
            "Bei Beschwerden wie schweren Beinen kann eine apparative Kompression interessant sein. Die Anwendung sollte jedoch zur individuellen Situation passen."
    },

    {
        id: 6,
        name: "NOVAFON power 2",
        category: "Therapie",
        image: "images/novaphone.webp",
        page: "novafon-power2.html",
        amazon: "https://amzn.to/4co6kwu",

        shortDescription:
            "Schallwellengerät für die professionelle Anwendung und als mögliche Ergänzung physiotherapeutischer Maßnahmen.",

        recommendation:
            "NOVAFON kann je nach Indikation eine interessante Ergänzung in der physiotherapeutischen Behandlung sein."
    },

   
    {
        id: 8,
        name: "Wellax Akupressurmatte",
        category: "Regeneration",
        image: "images/akupressurmatte.webp",
        page: "wellax-akupressurmatte.html",
        amazon: "https://amzn.to/45MNP0N",

        shortDescription:
            "Akupressurmatte mit Kissen zur Entspannung und als Ergänzung zur Regeneration.",

        recommendation:
            "Eine Akupressurmatte kann für manche Menschen eine angenehme Möglichkeit zur Entspannung und Regeneration sein."
    },

    {
        id: 9,
        name: "Devoko Höhenverstellbarer Schreibtisch",
        category: "Ergonomie & Arbeitsplatz",
        image: "images/devoko_tisch.webp",
        page: "devoko-schreibtisch.html",
        amazon: "https://amzn.to/4wG5XVY",

        shortDescription:
            "Elektrisch höhenverstellbarer Schreibtisch mit 2 Motoren und 200 × 80 cm Tischplatte für einen flexibleren Arbeitsplatz.",

        recommendation:
            "Aus physiotherapeutischer Sicht finde ich einen höhenverstellbaren Schreibtisch besonders interessant, weil er regelmäßige Positionswechsel während des Arbeitstages ermöglicht. Der Wechsel zwischen Sitzen und Stehen kann helfen, lange statische Arbeitshaltungen zu reduzieren."
    },

    {
        id: 10,
        name: "EXCEBET Chefsessel Bürostuhl XXL",
        category: "Ergonomie & Arbeitsplatz",
        image: "images/chefsessel_excebet.webp",
        page: "ergonomischer-chefsessel.html",
        amazon: "https://amzn.to/4hXjELz",

        shortDescription:
            "Ergonomischer XXL-Bürostuhl mit Fußstütze, hoher Rückenlehne und einer Belastbarkeit von bis zu 200 kg.",

        recommendation:
            "Ein gut einstellbarer Bürostuhl kann eine wichtige Grundlage für einen komfortableren Arbeitsplatz sein. Aus physiotherapeutischer Sicht sind jedoch nicht nur Polsterung und Rückenlehne entscheidend, sondern vor allem eine passende Sitzhöhe, eine gute Positionierung des Arbeitsplatzes und regelmäßige Bewegung."
    },

    {
        id: 11,
        name: "TheraBand Gymnastikband",
        category: "Fitness & Training",
        image: "images/theraband.webp",
        page: "theraband.html",
        amazon: "https://amzn.to/4iIOhVs",

        shortDescription:
            "Original TheraBand Gymnastikband für vielseitige Kraft-, Mobilisations- und Stabilisationsübungen zu Hause.",

        recommendation:
            "Ein TheraBand kann vielseitig für Kraft-, Mobilisations- und Stabilisationsübungen eingesetzt werden. Durch sein geringes Gewicht lässt es sich einfach zu Hause oder unterwegs verwenden und kann eine praktische Ergänzung für individuelles Training sein."
    },


    {
        id: 12,
        name: "Skandika Wasserrudergerät Lykke",
        category: "Fitness & Training",
       image: "images/skandikaruderngeratwasser.webp",
       page: "skandikarudergerätwasser.html",
        amazon: "https://amzn.to/3StyC1T",

        shortDescription:
            "Hochwertiges Wasserrudergerät aus Holz für vielseitiges Ganzkörper- und Ausdauertraining zu Hause.",

        recommendation:
            "Das ist mein persönlicher Favorit für das Training zu Hause. Ich mag das natürliche Gefühl beim Rudern und besonders das Geräusch des Wassers. Für mich macht genau das den Unterschied: Wenn man rudert und dabei das Wasser hört und die Landschaft auf dem Display sieht, fühlt es sich fast ein bisschen wie Urlaub an. Das Training macht mir dadurch besonders viel Spaß."
    }
    ];