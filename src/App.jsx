import { useState, useEffect, useCallback } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const TOWNS = [
  {
    id: "akita-001", prefecture: "秋田県", name: "仙北市", lat: 39.7183, lng: 140.1023,
    sos_score: 94, aging_rate: 51, population: 26000, rent: 32000, commute_min: 0,
    issues: ["介護人材不足", "農業後継者不足", "地域交通"],
    strengths: ["日本一の米産地（あきたこまち）", "角館武家屋敷・観光資源", "田沢湖の絶景"],
    industries: [{ name: "農業", detail: "米・野菜・果物" }, { name: "観光", detail: "インバウンド増加中" }],
    support: ["移住支援金最大100万円", "空き家バンクあり", "子育て支援充実", "外国人相談窓口"],
    foreigners_ok: true,
    jobs: [
      { id: "j1", period: "spot", type: "単発アルバイト", title: "田植えアルバイト", date: "6/14〜15", pay: 8500, transport: true, gift_id: "g1" },
      { id: "j2", period: "spot", type: "単発アルバイト", title: "稲刈りスタッフ", date: "9/20〜21", pay: 9000, transport: true, gift_id: "g1" },
      { id: "j3", period: "short", type: "ボランティア", title: "観光案内ボランティア", date: "7月〜8月", pay: null, transport: false, gift_id: "g2" },
      { id: "j4", period: "mid", type: "副業", title: "SNS・広報支援", date: "3ヶ月〜", pay: "要相談", transport: false, gift_id: "g2", remote: true },
      { id: "j5", period: "long", type: "移住して働く", title: "介護スタッフ（正社員）", date: "通年", pay: 200000, transport: false, gift_id: null },
    ],
    gifts: [
      { id: "g1", name: "あきたこまち 5kg", type: "product", emoji: "🌾" },
      { id: "g2", name: "角館・田沢湖 宿泊体験", type: "experience", emoji: "🏯" },
    ],
    voices: [
      { type: "resident", name: "田中 正義さん（68歳・農家）", comment: "若い人が来てくれるだけで、集落全体が明るくなります。田んぼの作業を一緒にやってほしい。", rating: 5 },
      { type: "migrant", name: "佐藤 花さん（32歳・東京から移住）", comment: "最初は不安でしたが、地域の方がすごく温かくて。家賃も安くて、食べ物がおいしくて最高です！", rating: 5 },
      { type: "visitor", name: "山田 剛さん（田植え参加）", comment: "初めての農作業でしたが楽しかった。お米ももらえてうれしかったです。また来ます！", rating: 4 },
    ],
    events: [
      { id: "e1", title: "大曲の花火（全国花火競技大会）", category: "fireworks", date: "2026-08-23", time: "17:30〜21:00", location: "大曲河川敷", has_staff_job: true, job_title: "会場誘導スタッフ", job_pay: 7500, free: false, expected_visitors: 750000 },
      { id: "e2", title: "角館の火振りかまくら", category: "festival", date: "2026-02-13", time: "19:00〜20:00", location: "角館市街地", has_staff_job: false, free: true, expected_visitors: 8000 },
      { id: "e3", title: "仙北市農業大学 収穫祭", category: "culture", date: "2026-10-19", time: "10:00〜15:00", location: "農業大学構内", has_staff_job: true, job_title: "出店・運営スタッフ", job_pay: 6000, free: true, expected_visitors: 3000 },
      { id: "e4", title: "田沢湖マラソン", category: "sport", date: "2026-09-14", time: "9:00〜12:00", location: "田沢湖畔", has_staff_job: true, job_title: "給水・誘導ボランティア", job_pay: null, free: false, expected_visitors: 5000 },
      { id: "e5", title: "移住・定住相談会 in 仙北", category: "other", date: "2026-07-12", time: "13:00〜17:00", location: "仙北市役所", has_staff_job: false, free: true, expected_visitors: 200 },
    ],
    characters: [
      { type: "mascot", name: "かくのだてくん", emoji: "🏯", message: "角館の武士の心意気で、みなさんをお迎えします！一緒に仙北を盛り上げませんか？", use_ai: false },
      { type: "celebrity", name: "吉永小百合さん（田沢湖ゆかりの女優）", emoji: "🎬", message: "田沢湖の美しさは日本一。この町の人たちの温かさも日本一です。ぜひ一度来てみてください。", use_ai: false },
    ],
  },
  {
    id: "shimane-001", prefecture: "島根県", name: "津和野町", lat: 34.4667, lng: 131.7667,
    sos_score: 91, aging_rate: 49, population: 7800, rent: 28000, commute_min: 0,
    issues: ["農業後継者不足", "空き家増加", "高齢者交通"],
    strengths: ["山陰の小京都・景観資源", "鮎・石州和紙の伝統産業", "移住者支援が充実"],
    industries: [{ name: "伝統工芸", detail: "石州和紙・陶芸" }, { name: "農業", detail: "鮎・有機野菜" }],
    support: ["空き家バンク活用補助", "子育て世帯家賃補助", "移住コーディネーターあり"],
    foreigners_ok: false,
    jobs: [
      { id: "j1", period: "spot", type: "単発アルバイト", title: "鷺舞祭り設営スタッフ", date: "7/20〜21", pay: 7000, transport: true, gift_id: "g1" },
      { id: "j2", period: "mid", type: "副業", title: "和紙工房のECサイト構築", date: "2ヶ月", pay: "要相談", remote: true, gift_id: "g2" },
      { id: "j3", period: "long", type: "移住して働く", title: "農業担い手（就農支援あり）", date: "通年", pay: 180000, gift_id: null },
    ],
    gifts: [
      { id: "g1", name: "石州和紙 作品セット", type: "product", emoji: "📜" },
      { id: "g2", name: "津和野 鮎料理体験", type: "experience", emoji: "🐟" },
    ],
    voices: [
      { type: "resident", name: "中村 義雄さん（71歳・和紙職人）", comment: "私の技術を次の世代に伝えたい。和紙づくりに興味のある方、ぜひ来てください。", rating: 5 },
      { type: "migrant", name: "木村 誠さん（29歳・大阪から移住）", comment: "町全体が歴史的な街並みで、毎日が映画の中にいるみたい。空き家を改装して快適に暮らしています。", rating: 5 },
    ],
    events: [
      { id: "e1", title: "鷺舞祭り（国指定重要無形民俗文化財）", category: "festival", date: "2026-07-20", time: "14:00〜16:00", location: "津和野町市街地", has_staff_job: true, job_title: "設営・案内スタッフ", job_pay: 7000, free: true, expected_visitors: 20000 },
      { id: "e2", title: "津和野夏の花火大会", category: "fireworks", date: "2026-08-16", time: "20:00〜21:00", location: "津和野川河川敷", has_staff_job: false, free: true, expected_visitors: 5000 },
    ],
    characters: [
      { type: "mascot", name: "つわぶきちゃん", emoji: "🌸", message: "山陰の小京都・津和野へようこそ！伝統と自然があなたを待っています。", use_ai: false },
    ],
  },
  {
    id: "nagano-001", prefecture: "長野県", name: "小海町", lat: 36.0667, lng: 138.5833,
    sos_score: 87, aging_rate: 44, population: 4500, rent: 35000, commute_min: 0,
    issues: ["IT人材不足", "観光業の担い手不足", "子育て環境整備"],
    strengths: ["標高1000mの高原リゾート", "八ヶ岳・清里の絶景", "移住者コミュニティが活発"],
    industries: [{ name: "観光", detail: "ペンション・スキー場" }, { name: "農業", detail: "高原野菜・レタス" }],
    support: ["UIターン奨励金あり", "テレワーク移住補助", "保育所完備"],
    foreigners_ok: true,
    jobs: [
      { id: "j1", period: "spot", type: "単発アルバイト", title: "八ヶ岳マラソン運営スタッフ", date: "5/25", pay: 8000, transport: true, gift_id: "g1" },
      { id: "j2", period: "mid", type: "リモート支援", title: "観光サイトのDX改善", date: "3ヶ月", pay: "要相談", remote: true, gift_id: "g2" },
      { id: "j3", period: "mid", type: "副業", title: "外国人観光客向け英語ガイド", date: "7〜9月", pay: 15000, transport: false, gift_id: "g1" },
      { id: "j4", period: "long", type: "移住して働く", title: "観光施設スタッフ（テレワーク兼務可）", date: "通年", pay: 220000, gift_id: null },
    ],
    gifts: [
      { id: "g1", name: "八ヶ岳高原 レタス・野菜セット", type: "product", emoji: "🥬" },
      { id: "g2", name: "高原ペンション 1泊体験", type: "experience", emoji: "🏔️" },
    ],
    voices: [
      { type: "migrant", name: "高橋 明さん（35歳・IT企業からUターン）", comment: "東京でリモートワークしながら長野で暮らしています。空気が違う、食が違う、人が違う。最高の選択でした。", rating: 5 },
    ],
    events: [
      { id: "e1", title: "小海リエックス 夏まつり花火", category: "fireworks", date: "2026-08-02", time: "20:00〜20:30", location: "小海リエックス", has_staff_job: false, free: false, expected_visitors: 8000 },
      { id: "e2", title: "八ヶ岳高原音楽祭", category: "other", date: "2026-08-09", time: "15:00〜21:00", location: "清里高原", has_staff_job: true, job_title: "運営・設営スタッフ", job_pay: 8000, free: false, expected_visitors: 15000 },
    ],
    characters: [
      { type: "ai", name: "こうみちゃん（AI）", emoji: "⛰️", message: "八ヶ岳の麓、標高1000mの町からこんにちは！ITスキルを持つあなた、ここで新しい働き方を見つけませんか？", use_ai: true },
    ],
  },
  {
    id: "hokkaido-001", prefecture: "北海道", name: "東川町", lat: 43.7, lng: 142.5,
    sos_score: 82, aging_rate: 38, population: 8500, rent: 45000, commute_min: 0,
    issues: ["観光人材不足", "英語対応人材不足", "宿泊業担い手不足"],
    strengths: ["旭岳・大雪山国立公園", "写真文化発信の町", "外国人観光客急増中"],
    industries: [{ name: "観光", detail: "インバウンド・登山" }, { name: "農業", detail: "米・野菜・チーズ" }],
    support: ["移住体験住宅あり", "家具付き短期滞在可", "英語話者歓迎"],
    foreigners_ok: true,
    jobs: [
      { id: "j1", period: "spot", type: "単発アルバイト", title: "雪まつり設営スタッフ", date: "2/8〜9", pay: 10000, transport: false, gift_id: "g1" },
      { id: "j2", period: "short", type: "短期滞在", title: "英語ガイド（夏季）", date: "7〜8月", pay: 20000, transport: false, gift_id: "g2" },
      { id: "j3", period: "mid", type: "リモート支援", title: "多言語観光コンテンツ制作", date: "継続", pay: "要相談", remote: true, gift_id: "g1" },
    ],
    gifts: [
      { id: "g1", name: "東川米 ゆめぴりか 5kg", type: "product", emoji: "🌾" },
      { id: "g2", name: "旭岳ロープウェイ 往復乗車券", type: "experience", emoji: "🚡" },
    ],
    voices: [
      { type: "visitor", name: "Ahmed さん（外国人材・インドから来日）", comment: "Higashikawa is wonderful! People are kind and nature is amazing. I want to work here forever.", rating: 5 },
    ],
    events: [
      { id: "e1", title: "旭川冬まつり（氷彫刻世界大会）", category: "festival", date: "2026-02-07", time: "日中〜夜", location: "旭川市常盤公園", has_staff_job: true, job_title: "会場案内・多言語対応スタッフ", job_pay: 9000, free: true, expected_visitors: 200000 },
      { id: "e2", title: "東川町写真フェスタ", category: "other", date: "2026-08-03", time: "10:00〜18:00", location: "東川町文化ギャラリー", has_staff_job: false, free: true, expected_visitors: 3000 },
    ],
    characters: [
      { type: "mascot", name: "ひがしかわくん", emoji: "📸", message: "写真文化と大自然の町・東川へ！英語が得意なあなた、外国人観光客を一緒にもてなしましょう！", use_ai: false },
    ],
  },
  {
    id: "kochi-001", prefecture: "高知県", name: "四万十町", lat: 33.1833, lng: 133.1167,
    sos_score: 89, aging_rate: 46, population: 16000, rent: 30000, commute_min: 0,
    issues: ["介護・医療人材不足", "農林業後継者不足", "若者流出"],
    strengths: ["四万十川（日本最後の清流）", "カツオのたたき・海の幸", "自然体験ツーリズム"],
    industries: [{ name: "漁業", detail: "カツオ・うなぎ" }, { name: "農林業", detail: "しょうが・ゆず" }],
    support: ["空き家改修補助", "就農支援金あり", "お試し移住制度"],
    foreigners_ok: false,
    jobs: [
      { id: "j1", period: "spot", type: "単発アルバイト", title: "四万十川いかだ下りスタッフ", date: "7〜8月週末", pay: 8000, transport: false, gift_id: "g1" },
      { id: "j2", period: "short", type: "ボランティア", title: "カツオ祭り手伝い", date: "10/11〜12", pay: null, transport: false, gift_id: "g1" },
      { id: "j3", period: "long", type: "移住して働く", title: "地域おこし協力隊（農業）", date: "通年", pay: 166000, gift_id: null },
    ],
    gifts: [
      { id: "g1", name: "四万十産 カツオのたたきセット", type: "product", emoji: "🐟" },
      { id: "g2", name: "四万十川 川漁体験", type: "experience", emoji: "🎣" },
    ],
    voices: [
      { type: "resident", name: "岡本 幸子さん（58歳・旅館経営）", comment: "四万十川の清流を守りながら、観光で地域を元気にしたい。若い力が必要です！", rating: 5 },
    ],
    events: [
      { id: "e1", title: "四万十川 夏祭り花火大会", category: "fireworks", date: "2026-08-14", time: "20:00〜21:00", location: "四万十川河川敷", has_staff_job: false, free: true, expected_visitors: 12000 },
      { id: "e2", title: "四万十カツオ祭り", category: "festival", date: "2026-10-11", time: "10:00〜16:00", location: "四万十町商店街", has_staff_job: true, job_title: "出店・調理補助スタッフ", job_pay: 7000, free: true, expected_visitors: 8000 },
    ],
    characters: [
      { type: "mascot", name: "しまんとくん", emoji: "🌊", message: "日本最後の清流・四万十川があなたを待っています！自然と食の豊かさ、ぜひ体験してみて。", use_ai: false },
    ],
  },
  {
    id: "fukushima-001", prefecture: "福島県", name: "只見町", lat: 37.35, lng: 139.1833,
    sos_score: 96, aging_rate: 54, population: 4000, rent: 22000, commute_min: 0,
    issues: ["全産業での人材不足", "高齢化・医療アクセス", "冬季の孤立リスク"],
    strengths: ["只見線（奇跡の鉄道）絶景スポット", "豊富な積雪・スノーアクティビティ", "ブナ原生林・自然遺産"],
    industries: [{ name: "観光", detail: "只見線ファン・撮り鉄" }, { name: "林業", detail: "ブナ材・木工" }],
    support: ["移住支援金（最大200万円）", "空き家無償提供制度", "医療費補助"],
    foreigners_ok: true,
    jobs: [
      { id: "j1", period: "spot", type: "単発アルバイト", title: "雪かきボランティア（有償）", date: "12〜3月 随時", pay: 6000, transport: true, gift_id: "g1" },
      { id: "j2", period: "spot", type: "単発アルバイト", title: "只見線撮影ガイド", date: "紅葉シーズン 10〜11月", pay: 7500, transport: false, gift_id: "g2" },
      { id: "j3", period: "long", type: "移住して働く", title: "地域おこし協力隊（全職種）", date: "通年", pay: 166000, gift_id: null },
    ],
    gifts: [
      { id: "g1", name: "只見町産 地酒 720ml", type: "product", emoji: "🍶" },
      { id: "g2", name: "只見線 絶景ツアー招待", type: "experience", emoji: "🚂" },
    ],
    voices: [
      { type: "resident", name: "渡辺 清さん（75歳・農家）", comment: "冬は雪が多くて大変ですが、春になるとこんなきれいな景色はどこにもない。ここは宝物の町です。", rating: 5 },
      { type: "migrant", name: "三浦 健さん（41歳・東京IT企業からリモート移住）", comment: "SOS最高スコアの町に来てみたら、人の温かさも最高でした。雪かきは大変だけど楽しいです。", rating: 4 },
    ],
    events: [
      { id: "e1", title: "只見雪まつり", category: "festival", date: "2026-02-08", time: "10:00〜21:00", location: "只見町中心部", has_staff_job: true, job_title: "会場設営・雪像制作補助", job_pay: 6500, free: true, expected_visitors: 5000 },
    ],
    characters: [
      { type: "mascot", name: "ただみん", emoji: "🌨️", message: "SOS日本一の只見町です！だからこそ、来てくれる方への感謝も日本一。移住支援金も最高額でお待ちしています！", use_ai: false },
    ],
  },
  {
    id: "oita-001", prefecture: "大分県", name: "九重町", lat: 33.2167, lng: 131.1667,
    sos_score: 85, aging_rate: 43, population: 9000, rent: 33000, commute_min: 0,
    issues: ["温泉旅館の担い手不足", "農業後継者不足", "IT人材皆無"],
    strengths: ["日本一の温泉地（湧出量）", "九重連山・くじゅう花公園", "ジビエ・有機農業"],
    industries: [{ name: "観光・温泉", detail: "旅館・ペンション" }, { name: "農業", detail: "有機野菜・ジビエ" }],
    support: ["温泉入り放題（移住者特典）", "農業研修制度", "移住者向け交流会"],
    foreigners_ok: true,
    jobs: [
      { id: "j1", period: "spot", type: "単発アルバイト", title: "花公園 植栽・整備スタッフ", date: "春・秋 各3日", pay: 7000, transport: false, gift_id: "g1" },
      { id: "j2", period: "mid", type: "副業", title: "旅館のSNS・動画制作", date: "3ヶ月〜", pay: "要相談", remote: true, gift_id: "g2" },
      { id: "j3", period: "long", type: "移住して働く", title: "温泉旅館スタッフ（住込み可）", date: "通年", pay: 190000, gift_id: "g2" },
    ],
    gifts: [
      { id: "g1", name: "くじゅう産 有機野菜セット", type: "product", emoji: "🥕" },
      { id: "g2", name: "九重温泉 1泊2食招待", type: "experience", emoji: "♨️" },
    ],
    voices: [
      { type: "resident", name: "松永 優子さん（45歳・旅館女将）", comment: "日本一の温泉があるのに担い手がいない。一緒にこの温泉文化を守ってほしいんです。", rating: 5 },
    ],
    events: [
      { id: "e1", title: "くじゅう花公園 春の花まつり", category: "nature", date: "2026-05-03", time: "9:00〜17:00", location: "くじゅう花公園", has_staff_job: true, job_title: "ガイド・案内スタッフ", job_pay: 7000, free: false, expected_visitors: 30000 },
    ],
    characters: [
      { type: "mascot", name: "くじゅうベア", emoji: "♨️", message: "日本一の温泉に入りながら働きませんか？体も心もポカポカの九重町でお待ちしています！", use_ai: false },
    ],
  },
  {
    id: "iwate-001", prefecture: "岩手県", name: "遠野市", lat: 39.3333, lng: 141.5333,
    sos_score: 88, aging_rate: 42, population: 26000, rent: 38000, commute_min: 0,
    issues: ["介護人材不足", "若者Uターン促進", "農業後継者"],
    strengths: ["日本のふるさと（民話の里）", "ホップ産地（ビール原料）", "カッパ伝説・ユニーク観光"],
    industries: [{ name: "農業", detail: "ホップ・山菜" }, { name: "観光", detail: "民話・体験ツーリズム" }],
    support: ["Uターン奨励金", "住宅改修補助", "農業就農支援"],
    foreigners_ok: false,
    jobs: [
      { id: "j1", period: "spot", type: "単発アルバイト", title: "ホップ収穫アルバイト", date: "8月上旬 5日間", pay: 8000, transport: true, gift_id: "g1" },
      { id: "j2", period: "short", type: "ボランティア", title: "遠野まつり 民俗芸能補助", date: "9/12〜14", pay: null, transport: false, gift_id: "g2" },
    ],
    gifts: [
      { id: "g1", name: "遠野産 ホップビール 6本セット", type: "product", emoji: "🍺" },
      { id: "g2", name: "遠野民話語り部 体験ツアー", type: "experience", emoji: "📖" },
    ],
    voices: [
      { type: "resident", name: "佐々木 龍さん（55歳・ホップ農家）", comment: "ここのホップが全国のビールになるんですよ。この誇りある農業を一緒にやりませんか。", rating: 5 },
    ],
    events: [
      { id: "e1", title: "遠野まつり", category: "festival", date: "2026-09-13", time: "10:00〜19:00", location: "遠野市内各所", has_staff_job: true, job_title: "祭り補助・案内スタッフ", job_pay: 6500, free: true, expected_visitors: 50000 },
      { id: "e2", title: "遠野ホップ収穫祭", category: "nature", date: "2026-08-10", time: "10:00〜15:00", location: "遠野ホップ農場", has_staff_job: false, free: false, expected_visitors: 1000 },
    ],
    characters: [
      { type: "mascot", name: "カッパくん", emoji: "🦎", message: "カッパの里・遠野へようこそ！ホップ畑でビールの原料を収穫しながら、民話の世界に浸りませんか？", use_ai: false },
    ],
  },
];

// ============================================================
// HELPERS
// ============================================================
const PERIOD_LABELS = { spot: "スポット", short: "短期", mid: "中期", long: "長期" };
const PERIOD_COLORS = {
  spot: "bg-orange-100 text-orange-800 border-orange-200",
  short: "bg-blue-100 text-blue-800 border-blue-200",
  mid: "bg-purple-100 text-purple-800 border-purple-200",
  long: "bg-red-100 text-red-800 border-red-200",
};
const EVT_COLORS = {
  fireworks: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: "✨", label: "花火大会" },
  festival:  { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    icon: "🎏", label: "祭り・神事" },
  culture:   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   icon: "🏫", label: "文化祭" },
  sport:     { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  icon: "🏃", label: "スポーツ" },
  market:    { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: "🛍️", label: "マーケット" },
  nature:    { bg: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-200",icon: "🌿", label: "自然・農業体験" },
  other:     { bg: "bg-gray-50",   text: "text-gray-600",   border: "border-gray-200",   icon: "📌", label: "その他" },
};

function sosColor(score) {
  if (score >= 90) return { bg: "bg-red-500", text: "text-red-600", light: "bg-red-50", border: "border-red-200", label: "緊急" };
  if (score >= 80) return { bg: "bg-amber-400", text: "text-amber-600", light: "bg-amber-50", border: "border-amber-200", label: "注意" };
  return { bg: "bg-blue-400", text: "text-blue-600", light: "bg-blue-50", border: "border-blue-200", label: "やや不足" };
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function distanceLabel(km) {
  const h = km / 80;
  if (h < 1) return `約${Math.round(h*60)}分`;
  return `約${h.toFixed(1)}時間`;
}

function formatPay(pay) {
  if (!pay) return "ボランティア";
  if (typeof pay === "string") return pay;
  return `¥${pay.toLocaleString()}`;
}

function formatDate(dateStr) {
  if (!dateStr || !dateStr.includes("-")) return dateStr;
  const d = new Date(dateStr);
  const days = ["日","月","火","水","木","金","土"];
  return { month: d.getMonth()+1, day: d.getDate(), dow: days[d.getDay()] };
}

// ============================================================
// MOCK USER STATE
// ============================================================
const MOCK_USER = {
  name: "小野 太郎",
  skills: ["IT・DX支援", "英語", "農業体験あり"],
  location: { lat: 35.6585, lng: 139.7454, label: "東京都 渋谷区" },
  hometown: "秋田県",
  wantedStyles: ["spot", "mid"],
  travelHours: 3,
  favorites: ["akita-001"],
  history: [
    { jobId: "j1", townId: "akita-001", title: "田植えアルバイト — 仙北市", status: "completed", date: "2026-05-18", giftReceived: "g1" }
  ],
};

// Claude APIを直接ブラウザから呼ぶと、APIキー漏洩・CORS制約のリスクがあります。
// デモでは VITE_CLAUDE_PROXY_URL がある場合のみプロキシ経由でAI生成し、
// 未設定時は自然なモック回答にフォールバックします。
const CLAUDE_PROXY_URL = import.meta.env.VITE_CLAUDE_PROXY_URL || "";

async function generateWithClaude(prompt, fallbackText) {
  if (!CLAUDE_PROXY_URL) return fallbackText;
  try {
    const res = await fetch(CLAUDE_PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error(`AI proxy error: ${res.status}`);
    const data = await res.json();
    return data.text || data.message || data.content?.[0]?.text || fallbackText;
  } catch (error) {
    console.warn("AI generation fallback:", error);
    return fallbackText;
  }
}

// ============================================================
// SUB COMPONENTS
// ============================================================
function Badge({ children, className = "" }) {
  return <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${className}`}>{children}</span>;
}

function PeriodBadge({ period }) {
  return <Badge className={`border ${PERIOD_COLORS[period]}`}>{PERIOD_LABELS[period]}</Badge>;
}

function SosBar({ score }) {
  const c = sosColor(score);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${c.bg} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-sm font-bold ${c.text}`}>{score}</span>
    </div>
  );
}

function CharacterBubble({ char, townName }) {
  const [aiMsg, setAiMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 200);
    return () => clearTimeout(t);
  }, []);

  async function generateAI() {
    setLoading(true);
    const prompt = `あなたは「${char.name}」というキャラクターです。${townName}のPRキャラクターとして、移住・支援希望者に向けた温かく魅力的な一言メッセージを50文字以内で生成してください。キャラクターらしい口調で。`;
    const fallback = `${townName}には、あなたの力を待っている人がいます。まずは週末から会いに来てください。`;
    setAiMsg(await generateWithClaude(prompt, fallback || char.message));
    setLoading(false);
  }

  const message = aiMsg || char.message;
  const typeLabel = { mascot: "公式キャラクター", celebrity: "地元出身", ai: "AIキャラ", resident: "住民代表" };
  const typeBg = { mascot: "bg-indigo-50 text-indigo-700", celebrity: "bg-amber-50 text-amber-700", ai: "bg-purple-50 text-purple-700", resident: "bg-green-50 text-green-700" };

  return (
    <div className={`flex gap-3 items-start transition-all duration-500 ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-2xl border border-indigo-100 shadow-sm">
        {char.emoji}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-700">{char.name}</span>
          <Badge className={typeBg[char.type]}>{typeLabel[char.type]}</Badge>
        </div>
        <div className="relative bg-indigo-50 border border-indigo-100 rounded-lg rounded-tl-none px-3 py-2 text-sm text-gray-800 leading-relaxed">
          {loading ? <span className="text-gray-400 animate-pulse">生成中...</span> : message}
        </div>
        {char.use_ai && !aiMsg && (
          <button onClick={generateAI} className="mt-1.5 text-xs text-indigo-600 hover:text-indigo-800 underline">
            AIで新しい一言を生成
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// TOWN CARD
// ============================================================
function TownCard({ town, userLoc, favorites, onToggleFav, onClick }) {
  const c = sosColor(town.sos_score);
  const dist = userLoc ? haversine(userLoc.lat, userLoc.lng, town.lat, town.lng) : null;
  const distH = dist ? dist / 80 : null;
  const isFav = favorites.includes(town.id);
  const spotJobs = town.jobs.filter(j => j.period === "spot");
  const char = town.characters?.[0];

  return (
    <div
      onClick={() => onClick(town)}
      className={`relative bg-white border-2 rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5 group ${c.border}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">{town.prefecture}</div>
          <div className="text-base font-bold text-gray-900">{town.name}</div>
        </div>
        <div className="flex items-center gap-2">
          {distH !== null && distH <= 3 && (
            <Badge className="bg-green-100 text-green-700 border border-green-200">
              📍 {distanceLabel(dist)}
            </Badge>
          )}
          <button
            onClick={e => { e.stopPropagation(); onToggleFav(town.id); }}
            className="text-lg leading-none"
          >
            {isFav ? "❤️" : "🤍"}
          </button>
        </div>
      </div>

      {/* SOS Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">SOSスコア</span>
          <Badge className={`${c.light} ${c.text} border ${c.border} text-xs`}>{c.label}</Badge>
        </div>
        <SosBar score={town.sos_score} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center bg-gray-50 rounded-lg py-1.5">
          <div className="text-xs text-gray-400">高齢化率</div>
          <div className="text-sm font-bold text-gray-700">{town.aging_rate}%</div>
        </div>
        <div className="text-center bg-gray-50 rounded-lg py-1.5">
          <div className="text-xs text-gray-400">家賃目安</div>
          <div className="text-sm font-bold text-gray-700">¥{(town.rent/10000).toFixed(1)}万</div>
        </div>
        <div className="text-center bg-gray-50 rounded-lg py-1.5">
          <div className="text-xs text-gray-400">外国人材</div>
          <div className="text-sm font-bold text-gray-700">{town.foreigners_ok ? "受入可" : "準備中"}</div>
        </div>
      </div>

      {/* Issues */}
      <div className="flex flex-wrap gap-1 mb-3">
        {town.issues.map(i => (
          <span key={i} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100">{i}</span>
        ))}
      </div>

      {/* Spot jobs */}
      {spotJobs.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-1.5">
          <div className="text-xs text-orange-600 font-medium">🕐 単発バイト {spotJobs.length}件</div>
          <div className="text-xs text-orange-500 mt-0.5">{spotJobs[0].title} ¥{typeof spotJobs[0].pay === "number" ? spotJobs[0].pay.toLocaleString() : spotJobs[0].pay}/日</div>
        </div>
      )}

      {/* Character peek */}
      {char && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
          <span>{char.emoji}</span>
          <span className="truncate">{char.message.slice(0, 28)}…</span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TOWN DETAIL
// ============================================================
function TownDetail({ town, userLoc, favorites, onToggleFav, onClose, isLoggedIn }) {
  const [tab, setTab] = useState("issues");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [evtFilter, setEvtFilter] = useState("all");
  const [aiRecommend, setAiRecommend] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const c = sosColor(town.sos_score);
  const isFav = favorites.includes(town.id);
  const dist = userLoc ? haversine(userLoc.lat, userLoc.lng, town.lat, town.lng) : null;

  const filteredJobs = periodFilter === "all" ? town.jobs : town.jobs.filter(j => j.period === periodFilter);
  const filteredEvts = evtFilter === "all" ? town.events : town.events.filter(e => e.category === evtFilter);

  async function generateAIComment() {
    setAiLoading(true);
    const prompt = `${town.prefecture}${town.name}について、移住・支援希望者向けの魅力的な紹介文を100文字以内で生成してください。強み：${town.strengths.join("、")}。課題：${town.issues.join("、")}。`;
    const fallback = `${town.name}は「${town.issues[0]}」という課題を抱えながら、${town.strengths[0]}という強みを持つ町です。あなたの関わりが、地域の未来を少し前に進めます。`;
    setAiRecommend(await generateWithClaude(prompt, fallback));
    setAiLoading(false);
  }

  const tabs = [
    { id: "issues", label: "課題・困りごと" },
    { id: "strengths", label: "地域の強み" },
    { id: "jobs", label: `関わり方 (${town.jobs.length}件)` },
    { id: "events", label: `イベント (${town.events.length}件)` },
    { id: "voices", label: "住民の声" },
    { id: "gifts", label: "返礼品" },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${c.light} border-b ${c.border} px-5 py-4`}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-sm text-gray-500">{town.prefecture}</div>
              <div className="text-xl font-bold text-gray-900">{town.name}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onToggleFav(town.id)} className="text-2xl">{isFav ? "❤️" : "🤍"}</button>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white/60 hover:bg-white rounded-full text-gray-500 text-lg">✕</button>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs text-gray-500">SOSスコア</span>
              <div className="flex-1"><SosBar score={town.sos_score} /></div>
              <Badge className={`${c.light} ${c.text} border ${c.border}`}>{c.label}</Badge>
            </div>
            {dist && <Badge className="bg-green-100 text-green-700 border border-green-200">📍 {distanceLabel(dist)}</Badge>}
            {town.foreigners_ok && <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-200">🌍 外国人材受入可</Badge>}
          </div>
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[
              ["人口", `${(town.population/10000).toFixed(1)}万人`],
              ["高齢化率", `${town.aging_rate}%`],
              ["家賃目安", `¥${(town.rent/10000).toFixed(1)}万`],
              ["通勤時間", `${town.commute_min}分`],
            ].map(([l, v]) => (
              <div key={l} className="text-center bg-white/60 rounded-lg py-1.5">
                <div className="text-xs text-gray-400">{l}</div>
                <div className="text-sm font-bold text-gray-700">{v}</div>
              </div>
            ))}
          </div>
          {/* Characters */}
          {town.characters?.length > 0 && (
            <div className="mt-3 space-y-2">
              {town.characters.map((ch, i) => <CharacterBubble key={i} char={ch} townName={town.name} />)}
            </div>
          )}
        </div>

        {/* AI紹介文 */}
        <div className="px-5 py-2 border-b border-gray-100 flex items-center gap-3">
          {aiRecommend ? (
            <p className="text-sm text-gray-700 flex-1">{aiRecommend}</p>
          ) : (
            <p className="text-xs text-gray-400 flex-1">AIがこの町の魅力を紹介します</p>
          )}
          <button
            onClick={generateAIComment}
            className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 flex-shrink-0"
          >
            {aiLoading ? "生成中…" : "✨ AI紹介文"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-100 px-2 flex-shrink-0">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${tab === t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* 課題 */}
          {tab === "issues" && (
            <div className="space-y-3">
              {town.issues.map(issue => (
                <div key={issue} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-3">
                  <span className="text-red-400 text-lg">🆘</span>
                  <div>
                    <div className="font-medium text-gray-800">{issue}</div>
                  </div>
                </div>
              ))}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-700">
                💬 あなたの力でこれらの課題を解決できるかもしれません。「関わり方」タブから支援方法を探してみてください。
              </div>
            </div>
          )}

          {/* 強み */}
          {tab === "strengths" && (
            <div className="space-y-3">
              {town.strengths.map(s => (
                <div key={s} className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <span className="text-emerald-500 text-lg">✅</span>
                  <div className="font-medium text-gray-800">{s}</div>
                </div>
              ))}
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">主要産業</div>
                <div className="grid grid-cols-2 gap-2">
                  {town.industries.map(ind => (
                    <div key={ind.name} className="bg-white border border-gray-200 rounded-xl p-3">
                      <div className="font-medium text-gray-700">{ind.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{ind.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">支援制度</div>
                {town.support.map(s => (
                  <div key={s} className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-gray-700">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 関わり方 */}
          {tab === "jobs" && (
            <div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {["all","spot","short","mid","long"].map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriodFilter(p)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${periodFilter === p ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}
                  >
                    {p === "all" ? "すべて" : PERIOD_LABELS[p]}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {filteredJobs.map(job => {
                  const gift = job.gift_id ? town.gifts.find(g => g.id === job.gift_id) : null;
                  return (
                    <div key={job.id} className={`border rounded-xl p-4 ${job.period === "spot" ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-white"}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <PeriodBadge period={job.period} />
                            <span className="text-xs text-gray-400">{job.type}</span>
                            {job.remote && <Badge className="bg-blue-50 text-blue-600 border border-blue-100">リモート可</Badge>}
                            {job.transport && <Badge className="bg-gray-50 text-gray-500 border border-gray-200">交通費支給</Badge>}
                          </div>
                          <div className="font-medium text-gray-900">{job.title}</div>
                          <div className="text-xs text-gray-400 mt-1">{job.date}</div>
                          {gift && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1 w-fit">
                              <span>🎁</span>
                              <span>返礼品：{gift.emoji} {gift.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-gray-900">{formatPay(job.pay)}</div>
                          <div className="text-xs text-gray-400">{job.period === "spot" ? "日給" : "報酬"}</div>
                          <button className="mt-2 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700">
                            {isLoggedIn ? "応募する" : "詳細を見る"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* イベント */}
          {tab === "events" && (
            <div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {["all","fireworks","festival","culture","sport","nature","other"].map(cat => {
                  const ec = EVT_COLORS[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setEvtFilter(cat)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${evtFilter === cat ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                    >
                      {cat === "all" ? "すべて" : `${ec.icon} ${ec.label}`}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-3">
                {filteredEvts.map(evt => {
                  const ec = EVT_COLORS[evt.category] || EVT_COLORS.other;
                  const df = formatDate(evt.date);
                  return (
                    <div key={evt.id} className={`border ${ec.border} ${ec.bg} rounded-xl p-4`}>
                      <div className="flex gap-3">
                        {df && typeof df === "object" ? (
                          <div className="flex-shrink-0 w-12 text-center bg-white rounded-xl py-1.5 border border-gray-100 shadow-sm">
                            <div className="text-xs text-gray-400">{df.month}月</div>
                            <div className="text-lg font-bold text-gray-800 leading-tight">{df.day}</div>
                            <div className="text-xs text-gray-400">{df.dow}</div>
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-12 text-center">
                            <div className="text-xl">{ec.icon}</div>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className={`text-xs font-medium ${ec.text}`}>{ec.icon} {ec.label}</span>
                                {evt.has_staff_job && (
                                  <Badge className="bg-green-100 text-green-700 border border-green-200">スタッフ募集中</Badge>
                                )}
                                {evt.free && <Badge className="bg-gray-100 text-gray-500 border border-gray-200">無料</Badge>}
                              </div>
                              <div className="font-medium text-gray-900 text-sm">{evt.title}</div>
                              <div className="text-xs text-gray-400 mt-0.5">{evt.time} ｜ {evt.location}</div>
                              {evt.expected_visitors && (
                                <div className="text-xs text-gray-400">来場者数 約{evt.expected_visitors.toLocaleString()}人</div>
                              )}
                            </div>
                          </div>
                          {evt.has_staff_job && (
                            <div className="mt-2 bg-white/70 border border-green-100 rounded-lg px-3 py-2">
                              <div className="text-xs font-medium text-green-700">募集：{evt.job_title}</div>
                              {evt.job_pay && <div className="text-xs text-green-600">日給 ¥{evt.job_pay.toLocaleString()}</div>}
                              <button className="mt-1.5 text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700">
                                スタッフ応募
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 住民の声 */}
          {tab === "voices" && (
            <div className="space-y-3">
              {town.voices.map((v, i) => {
                const typeLabel = { resident: "住民", migrant: "移住者", visitor: "体験者" };
                const typeBg = { resident: "bg-blue-100 text-blue-700", migrant: "bg-green-100 text-green-700", visitor: "bg-amber-100 text-amber-700" };
                return (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                        {v.type === "resident" ? "🏠" : v.type === "migrant" ? "🌱" : "✈️"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{v.name}</div>
                        <Badge className={typeBg[v.type]}>{typeLabel[v.type]}</Badge>
                      </div>
                      <div className="ml-auto text-yellow-400">{"★".repeat(v.rating)}{"☆".repeat(5-v.rating)}</div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">「{v.comment}」</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* 返礼品 */}
          {tab === "gifts" && (
            <div>
              <p className="text-sm text-gray-500 mb-4">活動・参加後にお礼として受け取れる地域の産品・体験です。</p>
              <div className="grid grid-cols-2 gap-3">
                {town.gifts.map(gift => (
                  <div key={gift.id} className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 text-center">
                    <div className="text-4xl mb-2">{gift.emoji}</div>
                    <div className="font-medium text-gray-800 text-sm">{gift.name}</div>
                    <Badge className={gift.type === "product" ? "bg-amber-100 text-amber-700 mt-2" : "bg-indigo-100 text-indigo-700 mt-2"}>
                      {gift.type === "product" ? "🛒 産品" : "🎟️ 体験"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AI RECOMMENDATION
// ============================================================
function AIRecommendPage({ towns, user, userLoc }) {
  const [skills, setSkills] = useState(user.skills.join("、"));
  const [style, setStyle] = useState("spot");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const SKILL_TAGS = ["IT・DX支援", "英語", "農業", "介護", "教育", "観光ガイド", "SNS運用", "料理", "医療"];

  function toggleSkill(skill) {
    setSkills(prev => {
      const list = prev.split(/[、,]/).map(v => v.trim()).filter(Boolean);
      const next = list.includes(skill) ? list.filter(v => v !== skill) : [...list, skill];
      return next.join("、");
    });
  }

  async function recommend() {
    setLoading(true);
    setResult("");
    const distInfo = userLoc
      ? towns.map(t => `${t.prefecture}${t.name}(距離${haversine(userLoc.lat,userLoc.lng,t.lat,t.lng).toFixed(0)}km,SOS${t.sos_score})`).join("、")
      : towns.map(t => `${t.prefecture}${t.name}(SOS${t.sos_score})`).join("、");
    const prompt = `あなたは地方移住・支援マッチングAIです。以下のユーザーに最適な自治体を3つ推薦し、それぞれ理由を2〜3文で説明してください。必ず実際の自治体名を使ってください。\n\nスキル：${skills}\n関わり方の希望：${PERIOD_LABELS[style]}\n出身地：${user.hometown}\n\n候補自治体：${distInfo}\n\n出力形式：\n1. [自治体名]\n理由：〜\n\n2. [自治体名]\n理由：〜\n\n3. [自治体名]\n理由：〜`;
    const ranked = [...towns]
      .map(t => ({ ...t, dist: userLoc ? haversine(userLoc.lat, userLoc.lng, t.lat, t.lng) : null }))
      .sort((a, b) => {
        const homeBoostA = user.hometown && a.prefecture === user.hometown ? 20 : 0;
        const homeBoostB = user.hometown && b.prefecture === user.hometown ? 20 : 0;
        const scoreA = a.sos_score + homeBoostA - (a.dist ? a.dist / 80 : 0);
        const scoreB = b.sos_score + homeBoostB - (b.dist ? b.dist / 80 : 0);
        return scoreB - scoreA;
      })
      .slice(0, 3);
    const fallback = ranked.map((t, i) => `${i + 1}. ${t.prefecture}${t.name}\n理由：${t.issues[0]}の支援ニーズが高く、${skills.split("、")[0] || "あなたのスキル"}を活かしやすい町です。${t.gifts?.[0] ? `活動後には「${t.gifts[0].name}」のような返礼品もあり、` : ""}まずは${PERIOD_LABELS[style]}から関われます。`).join("\n\n");
    setResult(await generateWithClaude(prompt, fallback));
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-gray-900 mb-1">AI推薦</h2>
      <p className="text-sm text-gray-500 mb-6">あなたのスキルと希望からぴったりの自治体をAIが提案します</p>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">スキル・職種</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {SKILL_TAGS.map(s => (
              <button
                key={s}
                onClick={() => toggleSkill(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${skills.includes(s) ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500 hover:border-indigo-300"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <input
            value={skills}
            onChange={e => setSkills(e.target.value)}
            placeholder="自由入力可"
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">関わり方の希望</label>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(PERIOD_LABELS).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setStyle(k)}
                className={`text-xs py-2 rounded-xl border transition-colors ${style === k ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500 hover:border-indigo-300"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={recommend}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-2xl font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? "✨ 推薦中..." : "✨ AIに推薦してもらう"}
        </button>

        {result && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4">
            <div className="text-xs font-medium text-indigo-600 mb-2">🤖 AIからの推薦</div>
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MYPAGE
// ============================================================
function MyPage({ user, towns, favorites, onToggleFav }) {
  const favTowns = towns.filter(t => favorites.includes(t.id));
  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
          {user.name[0]}
        </div>
        <div>
          <div className="font-bold text-lg">{user.name}</div>
          <div className="text-sm opacity-80">📍 {user.location.label}</div>
          {user.hometown && <div className="text-xs opacity-70 mt-0.5">🏡 出身：{user.hometown}</div>}
        </div>
      </div>

      <div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">スキル</div>
        <div className="flex flex-wrap gap-2">
          {user.skills.map(s => <Badge key={s} className="bg-indigo-50 text-indigo-700 border border-indigo-100">{s}</Badge>)}
        </div>
      </div>

      <div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">❤️ お気に入り自治体 ({favTowns.length}件)</div>
        {favTowns.length === 0 ? (
          <div className="text-sm text-gray-400 text-center py-6">まだお気に入りはありません</div>
        ) : (
          <div className="space-y-2">
            {favTowns.map(t => (
              <div key={t.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-gray-800">{t.prefecture} {t.name}</div>
                  <SosBar score={t.sos_score} />
                </div>
                <button onClick={() => onToggleFav(t.id)} className="text-xl ml-3">❤️</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">📋 活動履歴</div>
        {user.history.length === 0 ? (
          <div className="text-sm text-gray-400 text-center py-6">まだ活動履歴はありません</div>
        ) : (
          <div className="space-y-2">
            {user.history.map((h, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{h.title}</div>
                    <div className="text-xs text-gray-400">{h.date}</div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">参加済み</Badge>
                </div>
                {h.giftReceived && (
                  <div className="mt-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1">
                    🎁 返礼品受取済み
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// EVENTS PAGE (全国近隣イベント)
// ============================================================
function EventsPage({ towns, userLoc }) {
  const [catFilter, setCatFilter] = useState("all");
  const allEvents = towns.flatMap(t =>
    t.events.map(e => ({
      ...e,
      townName: t.name,
      prefecture: t.prefecture,
      townLat: t.lat,
      townLng: t.lng,
      dist: userLoc ? haversine(userLoc.lat, userLoc.lng, t.lat, t.lng) : null,
    }))
  ).sort((a, b) => {
    if (userLoc && a.dist !== null && b.dist !== null) return a.dist - b.dist;
    return new Date(a.date) - new Date(b.date);
  });

  const filtered = catFilter === "all" ? allEvents : allEvents.filter(e => e.category === catFilter);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-gray-900 mb-1">全国イベント</h2>
      {userLoc && <p className="text-sm text-green-600 mb-4">📍 現在地からの距離を表示中</p>}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {["all","fireworks","festival","culture","sport","nature","other"].map(cat => {
          const ec = EVT_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`text-xs flex-shrink-0 px-3 py-1.5 rounded-full border transition-colors ${catFilter === cat ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500"}`}
            >
              {cat === "all" ? "すべて" : `${ec.icon} ${ec.label}`}
            </button>
          );
        })}
      </div>
      <div className="space-y-3">
        {filtered.map((evt, i) => {
          const ec = EVT_COLORS[evt.category] || EVT_COLORS.other;
          const df = formatDate(evt.date);
          return (
            <div key={i} className={`border ${ec.border} ${ec.bg} rounded-xl p-4`}>
              <div className="flex gap-3">
                {df && typeof df === "object" ? (
                  <div className="flex-shrink-0 w-12 text-center bg-white rounded-xl py-1.5 border border-gray-100 shadow-sm">
                    <div className="text-xs text-gray-400">{df.month}月</div>
                    <div className="text-base font-bold text-gray-800 leading-tight">{df.day}</div>
                    <div className="text-xs text-gray-400">{df.dow}</div>
                  </div>
                ) : <div className="text-2xl">{ec.icon}</div>}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs font-medium ${ec.text}`}>{ec.icon} {ec.label}</span>
                    <span className="text-xs text-gray-400">{evt.prefecture} {evt.townName}</span>
                    {evt.dist && <Badge className="bg-green-100 text-green-700 border border-green-200 text-xs">📍 {distanceLabel(evt.dist)}</Badge>}
                    {evt.has_staff_job && <Badge className="bg-green-100 text-green-700 border border-green-200">スタッフ募集</Badge>}
                  </div>
                  <div className="font-medium text-gray-900 text-sm">{evt.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{evt.time} ｜ {evt.location}</div>
                  {evt.has_staff_job && evt.job_pay && (
                    <div className="mt-1.5 text-xs text-green-700 font-medium">
                      💼 {evt.job_title} ¥{evt.job_pay.toLocaleString()}/日
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function MachiMatch() {
  const [page, setPage] = useState("map");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user] = useState(MOCK_USER);
  const [userLoc, setUserLoc] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [favorites, setFavorites] = useState(["akita-001"]);
  const [selectedTown, setSelectedTown] = useState(null);
  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [onlyWithSpot, setOnlyWithSpot] = useState(false);
  const [onlyWithGift, setOnlyWithGift] = useState(false);
  const [travelFilter, setTravelFilter] = useState(0); // 0=off

  function toggleFav(id) {
    if (!isLoggedIn) { alert("お気に入りを保存するにはログインが必要です。"); return; }
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }

  function requestGPS() {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: "現在地" });
        setGpsLoading(false);
      },
      () => {
        // Fallback: Tokyo (demo)
        setUserLoc({ lat: 35.6585, lng: 139.7454, label: "東京都 渋谷区（デモ）" });
        setGpsLoading(false);
      },
      { timeout: 5000 }
    );
  }

  let towns = [...TOWNS];
  if (search) towns = towns.filter(t => t.name.includes(search) || t.prefecture.includes(search) || t.issues.some(i => i.includes(search)) || t.strengths.some(s => s.includes(search)));
  if (periodFilter !== "all") towns = towns.filter(t => t.jobs.some(j => j.period === periodFilter));
  if (onlyWithSpot) towns = towns.filter(t => t.jobs.some(j => j.period === "spot"));
  if (onlyWithGift) towns = towns.filter(t => t.gifts.length > 0);
  if (travelFilter > 0 && userLoc) towns = towns.filter(t => haversine(userLoc.lat, userLoc.lng, t.lat, t.lng) / 80 <= travelFilter);
  if (sortBy === "score") towns.sort((a, b) => b.sos_score - a.sos_score);
  else if (sortBy === "dist" && userLoc) towns.sort((a, b) => haversine(userLoc.lat,userLoc.lng,a.lat,a.lng) - haversine(userLoc.lat,userLoc.lng,b.lat,b.lng));

  const navItems = [
    { id: "map", icon: "🗾", label: "マップ" },
    { id: "events", icon: "🎆", label: "イベント" },
    { id: "ai", icon: "✨", label: "AI推薦" },
    { id: "mypage", icon: "👤", label: "マイページ" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif" }}>
      {/* TOP BAR */}
      <header className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗾</span>
            <div>
              <div className="font-bold text-base leading-none">Machi Match</div>
              <div className="text-xs opacity-70 leading-none mt-0.5">全国市町村 マッチングプラットフォーム</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* GPS */}
            <button
              onClick={requestGPS}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${userLoc ? "bg-green-500 border-green-400 text-white" : "border-white/40 text-white/80 hover:bg-white/10"}`}
            >
              {gpsLoading ? "📡..." : userLoc ? "📍 GPS ON" : "📍 GPS"}
            </button>
            {/* Login toggle */}
            <button
              onClick={() => setIsLoggedIn(p => !p)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${isLoggedIn ? "bg-white text-indigo-700 border-white font-medium" : "border-white/40 text-white/80 hover:bg-white/10"}`}
            >
              {isLoggedIn ? `👤 ${user.name.split(" ")[0]}` : "ログイン"}
            </button>
          </div>
        </div>
      </header>

      {/* GPS banner */}
      {userLoc && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-2 text-xs text-green-700 text-center">
          📍 現在地：{userLoc.label} からの距離表示が有効です
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1 pb-20">
        {/* MAP PAGE */}
        {page === "map" && (
          <div>
            {/* Search & filters */}
            <div className="bg-white border-b border-gray-100 sticky top-[56px] z-30 shadow-sm">
              <div className="max-w-2xl mx-auto px-4 py-3 space-y-2">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="🔍 市町村名・課題・産業で検索"
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-400"
                />
                <div className="flex gap-2 overflow-x-auto pb-0.5">
                  {/* Period filter */}
                  {["all","spot","short","mid","long"].map(p => (
                    <button
                      key={p}
                      onClick={() => setPeriodFilter(p)}
                      className={`flex-shrink-0 text-xs px-3 py-1 rounded-full border transition-colors ${periodFilter === p ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500"}`}
                    >
                      {p === "all" ? "すべて" : PERIOD_LABELS[p]}
                    </button>
                  ))}
                  <div className="w-px bg-gray-200 flex-shrink-0" />
                  <button
                    onClick={() => setOnlyWithSpot(p => !p)}
                    className={`flex-shrink-0 text-xs px-3 py-1 rounded-full border transition-colors ${onlyWithSpot ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-500"}`}
                  >
                    🕐 単発あり
                  </button>
                  <button
                    onClick={() => setOnlyWithGift(p => !p)}
                    className={`flex-shrink-0 text-xs px-3 py-1 rounded-full border transition-colors ${onlyWithGift ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-500"}`}
                  >
                    🎁 返礼品あり
                  </button>
                  {userLoc && (
                    <>
                      {[0,1,2,3].map(h => (
                        <button
                          key={h}
                          onClick={() => setTravelFilter(h)}
                          className={`flex-shrink-0 text-xs px-3 py-1 rounded-full border transition-colors ${travelFilter === h ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-500"}`}
                        >
                          {h === 0 ? "距離：全て" : `〜${h}時間`}
                        </button>
                      ))}
                    </>
                  )}
                  <div className="w-px bg-gray-200 flex-shrink-0" />
                  <button
                    onClick={() => setSortBy(p => p === "score" ? "dist" : "score")}
                    className="flex-shrink-0 text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-500"
                  >
                    {sortBy === "score" ? "🔥 SOS順" : "📍 距離順"}
                  </button>
                </div>
              </div>
            </div>

            {/* Emergency banner */}
            <div className="max-w-2xl mx-auto px-4 pt-4">
              <div className="bg-red-600 text-white rounded-2xl px-4 py-3 mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs opacity-80">今週末 緊急SOS</div>
                  <div className="font-bold">福島県 只見町 — SOS 96点</div>
                  <div className="text-xs opacity-80 mt-0.5">雪かきスタッフ 今すぐ必要！日給¥6,000+返礼品</div>
                </div>
                <button
                  onClick={() => setSelectedTown(TOWNS.find(t => t.id === "fukushima-001"))}
                  className="bg-white text-red-600 text-xs px-3 py-2 rounded-xl font-medium flex-shrink-0 ml-3"
                >
                  詳細 →
                </button>
              </div>
            </div>

            {/* Town grid */}
            <div className="max-w-2xl mx-auto px-4 pb-4">
              <div className="text-xs text-gray-400 mb-3">{towns.length}件の自治体</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {towns.map(t => (
                  <TownCard
                    key={t.id}
                    town={t}
                    userLoc={userLoc}
                    favorites={favorites}
                    onToggleFav={toggleFav}
                    onClick={setSelectedTown}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {page === "events" && <EventsPage towns={TOWNS} userLoc={userLoc} />}
        {page === "ai" && <AIRecommendPage towns={TOWNS} user={user} userLoc={userLoc} />}
        {page === "mypage" && (
          isLoggedIn
            ? <MyPage user={user} towns={TOWNS} favorites={favorites} onToggleFav={toggleFav} />
            : (
              <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                <div className="text-5xl mb-4">👤</div>
                <div className="text-lg font-bold text-gray-800 mb-2">ログインが必要です</div>
                <p className="text-sm text-gray-500 mb-6">マイページではお気に入り・活動履歴・返礼品の記録を管理できます。</p>
                <button onClick={() => setIsLoggedIn(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-medium hover:bg-indigo-700">
                  モックログイン（デモ用）
                </button>
              </div>
            )
        )}
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
        <div className="max-w-2xl mx-auto flex">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors ${page === item.id ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-xs leading-none">{item.label}</span>
              {page === item.id && <div className="w-4 h-0.5 bg-indigo-600 rounded-full mt-0.5" />}
            </button>
          ))}
        </div>
      </nav>

      {/* TOWN DETAIL MODAL */}
      {selectedTown && (
        <TownDetail
          town={selectedTown}
          userLoc={userLoc}
          favorites={favorites}
          onToggleFav={toggleFav}
          onClose={() => setSelectedTown(null)}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
}
