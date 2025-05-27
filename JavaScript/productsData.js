const products = [
    {
        id: 'product-card-1',
        brand: '3Dreams',
        title: 'Squalo Paffuto "Chompy"',
        images: [
            'assets/img/prodotto1.png',
            'assets/img/prodotto1_singolo.png'
        ],
        description: `Un adorabile squalo paffuto, catturato nel momento di relax. 
                      La sua forma rotonda e l'espressione giocosa lo rendono il compagno perfetto per la tua scrivania. 
                      Non lasciarti ingannare dal suo status di predatore, è un vero tenerone!`,
        price: 120,
        category: 'creature-adorabili', // Nuova categoria
        material: 'PLA'
    },
    {
        id: 'product-card-2',
        brand: '3Dreams',
        title: 'Cagnolino "Felice"',
        images: [
            'assets/img/prodotto2.png',
            'assets/img/prodotto2_singolo.png'
        ],
        description: `Un simpatico cagnolino seduto, con la lingua di fuori in un'espressione di pura gioia. 
                      Dettagli vivaci e una posa dinamica che porterà un sorriso a chiunque lo guardi.`,
        price: 150,
        category: 'creature-adorabili', // Nuova categoria
        material: 'PLA'
    },
    {
        id: 'product-card-3',
        brand: '3Dreams',
        title: 'Pinguino "Chubby"',
        images: [
            'assets/img/prodotto3.png',
            'assets/img/prodotto3_singolo.png'
        ],
        description: `Un pinguino paffuto e incredibilmente carino, con dettagli che esaltano la sua dolcezza. 
                      Perfetto per aggiungere un tocco di tenerezza alla tua collezione.`,
        price: 180,
        category: 'creature-adorabili', // Nuova categoria
        material: 'PLA'
    },
    {
        id: 'product-card-4',
        brand: '3Dreams',
        title: 'Coniglietto "Cotton Tail"',
        images: [
            'assets/img/prodotto4.png',
            'assets/img/prodotto4_singolo.png'
        ],
        description: `Questo coniglietto paffuto è una vera delizia, con le sue orecchie morbide e la sua posa adorabile. 
                      Un pezzo che sprigiona charme e allegria.`,
        price: 200,
        category: 'creature-adorabili', // Nuova categoria
        material: 'PLA'
    },
    {
        id: 'product-card-5',
        brand: '3Dreams',
        title: 'Ankylosaurus "Armato"',
        images: [
            'assets/img/prodotto5.png',
            'assets/img/prodotto5_singolo.png'
        ],
        description: `Una fedele riproduzione dell'Ankylosaurus, il dinosauro corazzato. 
                      Realizzato in resina di alta qualità per catturare ogni dettaglio della sua imponente armatura.`,
        price: 220,
        category: 'dinosauri', // Nuova categoria
        material: 'Resina'
    },
    {
        id: 'product-card-6',
        brand: '3Dreams',
        title: 'Brachiosaurus "Gigante"',
        images: [
            'assets/img/prodotto6.png',
            'assets/img/prodotto6_singolo.png'
        ],
        description: `L'iconico Brachiosaurus, con il suo lungo collo che si innalza. 
                      Questa scultura in resina rende giustizia alla sua grandezza e alla sua eleganza preistorica.`,
        price: 250,
        category: 'dinosauri', // Nuova categoria
        material: 'Resina'
    },
    {
        id: 'product-card-7',
        brand: '3Dreams',
        title: 'Velociraptor "Agile"',
        images: [
            'assets/img/prodotto7.png',
            'assets/img/prodotto7_singolo.png'
        ],
        description: `Il temibile e astuto Velociraptor, catturato in una posa dinamica che ne evidenzia la velocità. 
                      Dettagli realistici in resina per un'esperienza da brivido.`,
        price: 130,
        category: 'dinosauri', // Nuova categoria
        material: 'Resina'
    },
    {
        id: 'product-card-8',
        brand: '3Dreams',
        title: 'T-Rex "Re dei Dinosauri"',
        images: [
            'assets/img/prodotto8.png',
            'assets/img/prodotto8_singolo.png'
        ],
        description: `Il maestoso Tyrannosaurus Rex, re incontrastato del Cretaceo. 
                      Una scultura in resina che porta la potenza e la ferocia di questo iconico dinosauro direttamente a casa tua.`,
        price: 210,
        category: 'dinosauri', // Nuova categoria
        material: 'Resina'
    },
    {
        id: 'product-card-9',
        brand: '3Dreams',
        title: 'McLaren MCL38 2024',
        images: [
            'assets/img/prodotto9.png',
            'assets/img/prodotto9_singolo.png'
        ],
        description: `La McLaren MCL38 della stagione 2024, un capolavoro di ingegneria e design. 
                      Ricrea l'emozione della Formula 1 con questa replica dettagliata.`,
        price: 280,
        category: 'formula-1', // Nuova categoria
        material: 'PLA Rinforzato'
    },
    {
        id: 'product-card-10',
        brand: '3Dreams',
        title: 'F1 Concept22 2022',
        images: [
            'assets/img/prodotto10.png',
            'assets/img/prodotto10_singolo.png'
        ],
        description: `Il design avveniristico della F1 Concept22 del 2022, che anticipa le linee del futuro delle corse. 
                      Un pezzo unico per gli appassionati di design automobilistico.`,
        price: 300,
        category: 'formula-1', // Nuova categoria
        material: 'PLA Rinforzato'
    },
    {
        id: 'product-card-11',
        brand: '3Dreams',
        title: 'Aston Martin AMR23',
        images: [
            'assets/img/prodotto11.png',
            'assets/img/prodotto11_singolo.png'
        ],
        description: `La potente Aston Martin AMR23, un'elegante espressione di velocità e precisione. 
                      Ideale per i collezionisti che apprezzano le vetture da corsa iconiche.`,
        price: 170,
        category: 'formula-1', // Nuova categoria
        material: 'PLA Rinforzato'
    },
    {
        id: 'product-card-12',
        brand: '3Dreams',
        title: 'Alpine A522 2022',
        images: [
            'assets/img/prodotto12.png',
            'assets/img/prodotto12_singolo.png'
        ],
        description: `L'agile Alpine A522 del 2022, con i suoi colori distintivi e il design aerodinamico. 
                      Un modello imperdibile per gli amanti della Formula 1 e del marchio Alpine.`,
        price: 160,
        category: 'formula-1', // Nuova categoria
        material: 'PLA Rinforzato'
    }
];