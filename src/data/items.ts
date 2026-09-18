import { CostumeItem, ToolItem } from '../types/game';

export const COSTUMES: CostumeItem[] = [
  {
    id: 'explorer',
    name: 'Genç Kâşif',
    description: 'Rahat askıları ve dayanıklı botlarıyla klasik macera kıyafeti.',
    price: 0,
    hatColor: '#92400e', // brown cap
    vestColor: '#b45309', // warm leather
    badge: '🎒',
    specialTrait: 'Klasik Kâşif Karizması'
  },
  {
    id: 'miner',
    name: 'Baretli Madenci',
    description: 'Parlak güvenlik bareti ve reflektörlü tulumla donatılmıştır.',
    price: 100,
    hatColor: '#eab308', // bright yellow hardhat
    vestColor: '#ea580c', // safety orange
    badge: '⛑️',
    specialTrait: 'Yeraltı ipuçlarını daha hızlı açığa çıkarır'
  },
  {
    id: 'cowboy',
    name: 'Vahşi Batı İzcisi',
    description: 'Şık kovboy şapkası, deri yelek ve parlak yıldız rozeti.',
    price: 150,
    hatColor: '#78350f', // deep saddle leather
    vestColor: '#9a3412', // rust leather
    badge: '🤠',
    specialTrait: 'Büyük buluşlarda +%10 bonus mücevher'
  },
  {
    id: 'astronaut',
    name: 'Uzay Kâşifi',
    description: 'Renkli kozmik vizörlü ve oksijen tüplü fütüristik astronot kıyafeti.',
    price: 200,
    hatColor: '#0284c7', // aerospace blue & white
    vestColor: '#f8fafc', // astronaut white
    badge: '🚀',
    specialTrait: 'Sıfır yerçekimi hafif kazı hissi'
  },
  {
    id: 'royal',
    name: 'Kraliyet Maceracısı',
    description: 'Mücevher kralına yakışır kadife pelerin ve taşlı altın taç.',
    price: 350,
    hatColor: '#eab308', // pure gold crown
    vestColor: '#991b1b', // royal crimson
    badge: '👑',
    specialTrait: 'Kutlama konfetileri saçar'
  },
  {
    id: 'gold_miner',
    name: 'Altın Şampiyon',
    description: 'Parıldayan 24 ayar saf yeraltı altınından dövülmüş zırhlı kıyafet.',
    price: 500,
    hatColor: '#facc15',
    vestColor: '#ca8a04',
    badge: '✨',
    specialTrait: 'Maksimum mücevher çekim aurası'
  }
];

export const TOOLS: ToolItem[] = [
  {
    id: 'small_brush',
    name: 'Küçük Fırça',
    description: 'İnce arkeolojik temizleme fırçası. Toprağı nazikçe ve hassas şekilde süpürür.',
    price: 30,
    power: 0.8,
    digRadius: 11,
    speedMultiplier: 1.0,
    specialAbility: 'Hassas ve nazik tekli hücre süpürme',
    rarityColor: '#a8a29e',
    areaBadge: '11px • Hassas'
  },
  {
    id: 'big_brush',
    name: 'Büyük Fırça',
    description: 'Geniş yüzey toz alma fırçası. Üst toprak tabakasını genişçe ve yumuşakça süpürür.',
    price: 70,
    power: 1.0,
    digRadius: 18,
    speedMultiplier: 1.15,
    specialAbility: 'Geniş süpürme alanı ve yumuşak temizlik',
    rarityColor: '#d97706',
    areaBadge: '18px • Geniş Fırça'
  },
  {
    id: 'rake',
    name: 'Bahçe Tırmığı',
    description: 'Çok dişli sert tırmık. Toprağı çoklu hatlar halinde hızlıca havalandırıp kazar.',
    price: 120,
    power: 1.4,
    digRadius: 21,
    speedMultiplier: 1.3,
    specialAbility: '3 dişli geniş tarama ve hızlı havalandırma',
    rarityColor: '#16a34a',
    areaBadge: '21px • 3 Hatlı Tırmık'
  },
  {
    id: 'basic_shovel',
    name: 'Standart Kürek',
    description: 'Demir uçlu güvenilir ahşap kürek. Standart topraklar için idealdir.',
    price: 0,
    power: 1.2,
    digRadius: 17,
    speedMultiplier: 1.0,
    specialAbility: 'Dengeli tekli hücre kazısı',
    rarityColor: '#78716c',
    areaBadge: '17px • Standart'
  },
  {
    id: 'steel_shovel',
    name: 'Çelik Kürek',
    description: 'Güçlendirilmiş temperli çelik kafa. Sert killi toprağı kolayca yarar.',
    price: 200,
    power: 2.0,
    digRadius: 22,
    speedMultiplier: 1.4,
    specialAbility: 'Yoğun kili ve sert toprağı derin kazar',
    rarityColor: '#38bdf8',
    areaBadge: '22px • Güçlü Çelik'
  },
  {
    id: 'pickaxe',
    name: 'Madenci Kazması',
    description: 'Sivri çift uçlu madenci kazması. Sert kayaları ve taşlaşmış toprağı delip geçer.',
    price: 320,
    power: 3.0,
    digRadius: 20,
    speedMultiplier: 1.6,
    specialAbility: 'Kayaları ve sert zeminleri tek vuruşta parçalar',
    rarityColor: '#f97316',
    areaBadge: '20px • Kaya Delici'
  },
  {
    id: 'golden_shovel',
    name: 'Altın Kürek',
    description: 'Elmas kenarlı 24 ayar altın kürek. Hızlı kazar ve ışıl ışıl parıldar!',
    price: 500,
    power: 3.6,
    digRadius: 26,
    speedMultiplier: 1.85,
    specialAbility: 'Işıl ışıl parlayan geniş altın kazı',
    rarityColor: '#facc15',
    areaBadge: '26px • Geniş Altın'
  },
  {
    id: 'drill',
    name: 'Gelişmiş Matkap',
    description: 'Yeraltı engellerini un ufak eden yüksek torklu pnömatik spiral matkap ucu.',
    price: 750,
    power: 4.6,
    digRadius: 30,
    speedMultiplier: 2.3,
    specialAbility: 'Yüksek devirli pnömatik spiral parçalama',
    rarityColor: '#c084fc',
    areaBadge: '30px • Pnömatik Spiral'
  },
  {
    id: 'legendary_tool',
    name: 'Efsanevi Kazma-Kürek',
    description: 'Işıldayan göksel elmas kristaliyle güçlendirilmiş kadim yeraltı yadigârı.',
    price: 1000,
    power: 5.8,
    digRadius: 36,
    speedMultiplier: 2.7,
    specialAbility: 'Kozmik enerji patlaması ve ultra geniş alan',
    rarityColor: '#fb7185',
    areaBadge: '36px • Kozmik Alan'
  },
  {
    id: 'excavator',
    name: 'Dev Ekskavatör Kepçesi',
    description: 'Devasa hidrolik çelik kepçe dişleri. Tek seferde devasa toprak kütlelerini boşaltır.',
    price: 1500,
    power: 8.0,
    digRadius: 48,
    speedMultiplier: 3.2,
    specialAbility: 'Devasa hidrolik kepçe darbesi - tek hamlede dev alan kazar',
    rarityColor: '#e11d48',
    areaBadge: '48px • Devasa Kepçe'
  }
];
