// JLPT N2-N1 Grammar Data
// Format: { id, pattern, meaning, level, connection, explanation, choices: [{sentence, answer, options}] }

const GRAMMAR_DATA = [
  // ===== N2 GRAMMAR =====
  {
    id: "g_n2_001", pattern: "〜にもかかわらず", meaning: "儘管…、雖然…但是", level: "N2",
    connection: "名詞／動詞普通形／い形容詞／な形容詞語幹 + にもかかわらず",
    explanation: "表示「雖然前項條件成立，但後項出現了與預期相反的結果」。前後項內容形成對比。",
    choices: [
      {
        sentence: "雨が降っている___、彼は試合に出た。",
        answer: "にもかかわらず",
        options: ["にもかかわらず", "ために", "によって", "に対して"],
        translation: "儘管正在下雨，他還是出賽了。"
      },
      {
        sentence: "努力した___、結果は出なかった。",
        answer: "にもかかわらず",
        options: ["にもかかわらず", "おかげで", "せいで", "ので"],
        translation: "儘管努力了，但結果還是沒出來。"
      }
    ]
  },
  {
    id: "g_n2_002", pattern: "〜に対して", meaning: "針對…、對於…", level: "N2",
    connection: "名詞 + に対して",
    explanation: "表示動作或態度的對象、方向。也可表示對比（一方是…，另一方是…）。",
    choices: [
      {
        sentence: "先生の質問___、学生はなかなか答えられなかった。",
        answer: "に対して",
        options: ["に対して", "について", "にとって", "において"],
        translation: "針對老師的問題，學生遲遲無法回答。"
      },
      {
        sentence: "兄が内向的な性格な___、弟は社交的だ。",
        answer: "のに対して",
        options: ["のに対して", "ために", "のにもかかわらず", "くせに"],
        translation: "哥哥是內向的性格，相對地弟弟是外向的。"
      }
    ]
  },
  {
    id: "g_n2_003", pattern: "〜に関して", meaning: "關於…", level: "N2",
    connection: "名詞 + に関して／に関する + 名詞",
    explanation: "表示話題的範圍，意思與「について」相近，但「に関して」更正式，多用於書面語。",
    choices: [
      {
        sentence: "この問題___詳しく調べる必要がある。",
        answer: "に関して",
        options: ["に関して", "によって", "に対して", "に沿って"],
        translation: "關於這個問題，需要詳細調查。"
      },
      {
        sentence: "環境問題___の議論が活発になっている。",
        answer: "に関して",
        options: ["に関して", "について", "に対して", "に関する"],
        translation: "關於環境問題的討論正在變得活躍。"
      }
    ]
  },
  {
    id: "g_n2_004", pattern: "〜によって", meaning: "根據…、因…而、由…", level: "N2",
    connection: "名詞 + によって",
    explanation: "有多種用法：①手段方法 ②原因 ③被動句的動作主體 ④根據情況各有不同",
    choices: [
      {
        sentence: "この橋は1000年前の技術___造られた。",
        answer: "によって",
        options: ["によって", "に対して", "に関して", "において"],
        translation: "這座橋是用1000年前的技術建造的。"
      },
      {
        sentence: "人___意見が異なることは当然だ。",
        answer: "によって",
        options: ["によって", "にとって", "に対して", "に関して"],
        translation: "根據不同的人，意見有所不同是理所當然的。"
      }
    ]
  },
  {
    id: "g_n2_005", pattern: "〜において／〜における", meaning: "在…（場所/時間/範圍）", level: "N2",
    connection: "名詞 + において／における + 名詞",
    explanation: "書面語。表示動作或狀態發生的場所、時間、或範圍。比「で」更正式。",
    choices: [
      {
        sentence: "現代社会___、情報技術の重要性は増している。",
        answer: "において",
        options: ["において", "にとって", "に対して", "によって"],
        translation: "在現代社會中，資訊技術的重要性正在增加。"
      },
      {
        sentence: "国際会議___問題が議論された。",
        answer: "において",
        options: ["において", "に関して", "によって", "のために"],
        translation: "問題在國際會議上被討論。"
      }
    ]
  },
  {
    id: "g_n2_006", pattern: "〜に伴って", meaning: "隨著…、伴隨著…", level: "N2",
    connection: "名詞 + に伴って／動詞辞書形 + に伴って",
    explanation: "表示隨著前項的變化，後項也一起發生變化。後項多為自然產生的結果。",
    choices: [
      {
        sentence: "経済成長___、環境問題も深刻化している。",
        answer: "に伴って",
        options: ["に伴って", "に対して", "によって", "にもかかわらず"],
        translation: "隨著經濟成長，環境問題也在加劇。"
      },
      {
        sentence: "年齢を重ねる___、体力が落ちてきた。",
        answer: "に伴って",
        options: ["に伴って", "に従って", "につれて", "にあたって"],
        translation: "隨著年齡增長，體力下降了。"
      }
    ]
  },
  {
    id: "g_n2_007", pattern: "〜につれて", meaning: "隨著…、伴隨著…", level: "N2",
    connection: "動詞辞書形 + につれて／名詞 + につれて",
    explanation: "表示隨著前項的逐漸變化，後項也逐漸發生相應的變化。強調漸進性。",
    choices: [
      {
        sentence: "時間が経つ___、傷も癒えてきた。",
        answer: "につれて",
        options: ["につれて", "に伴って", "に従って", "と共に"],
        translation: "隨著時間流逝，傷也逐漸癒合了。"
      },
      {
        sentence: "日本語が上手になる___、自信もついてきた。",
        answer: "につれて",
        options: ["につれて", "に対して", "によって", "ために"],
        translation: "隨著日語變得流利，自信心也增加了。"
      }
    ]
  },
  {
    id: "g_n2_008", pattern: "〜を通じて／〜を通して", meaning: "通過…、藉由…", level: "N2",
    connection: "名詞 + を通じて／を通して",
    explanation: "表示藉由某種媒介、手段或整個期間。「を通じて」也可表示「整個某段時期」。",
    choices: [
      {
        sentence: "スポーツ___友情を育むことができる。",
        answer: "を通じて",
        options: ["を通じて", "によって", "に関して", "をもって"],
        translation: "可以藉由運動培養友情。"
      },
      {
        sentence: "メディア___情報が広まった。",
        answer: "を通じて",
        options: ["を通じて", "に対して", "に伴って", "をもとに"],
        translation: "資訊藉由媒體散播開來。"
      }
    ]
  },
  {
    id: "g_n2_009", pattern: "〜に基づいて", meaning: "根據…、基於…", level: "N2",
    connection: "名詞 + に基づいて／に基づく + 名詞",
    explanation: "表示以某事物為根據或依據來行動。含有「以此為標準或規則」的意味。",
    choices: [
      {
        sentence: "事実___報告書を作成した。",
        answer: "に基づいて",
        options: ["に基づいて", "にとって", "によって", "に対して"],
        translation: "根據事實製作了報告書。"
      },
      {
        sentence: "データ___の分析が重要だ。",
        answer: "に基づいた",
        options: ["に基づいた", "に関した", "によった", "に沿った"],
        translation: "根據數據的分析很重要。"
      }
    ]
  },
  {
    id: "g_n2_010", pattern: "〜をはじめ（として）", meaning: "以…為首、…等", level: "N2",
    connection: "名詞 + をはじめ（として）",
    explanation: "表示「以某個代表性的例子為首，還有其他許多」。常用於列舉。",
    choices: [
      {
        sentence: "東京___、日本の各都市を訪問した。",
        answer: "をはじめ",
        options: ["をはじめ", "を通じて", "に対して", "をもとに"],
        translation: "以東京為首，訪問了日本各城市。"
      },
      {
        sentence: "山田先生___多くの先生にお世話になった。",
        answer: "をはじめ",
        options: ["をはじめ", "をはじめとして", "についても", "はもちろん"],
        translation: "以山田老師為首，受到了許多老師的關照。"
      }
    ]
  },
  {
    id: "g_n2_011", pattern: "〜に加えて", meaning: "除了…還有、加上…", level: "N2",
    connection: "名詞 + に加えて／動詞辞書形 + に加えて",
    explanation: "在前項基礎上再添加後項，表示累加關係。",
    choices: [
      {
        sentence: "能力___、経験も重要な採用基準だ。",
        answer: "に加えて",
        options: ["に加えて", "に対して", "にもかかわらず", "において"],
        translation: "除了能力之外，經驗也是重要的錄用標準。"
      },
      {
        sentence: "雨___、風まで吹いてきた。",
        answer: "に加えて",
        options: ["に加えて", "にもかかわらず", "だけでなく", "のに"],
        translation: "除了下雨以外，連風也吹起來了。"
      }
    ]
  },
  {
    id: "g_n2_012", pattern: "〜としては", meaning: "作為…來說、就…而言", level: "N2",
    connection: "名詞 + としては",
    explanation: "表示從某種立場、身份或基準來判斷。",
    choices: [
      {
        sentence: "学生___、この成績は優秀だ。",
        answer: "としては",
        options: ["としては", "にとっては", "に対しては", "においては"],
        translation: "作為學生來說，這個成績很優秀。"
      },
      {
        sentence: "初心者___、よくできていると思う。",
        answer: "としては",
        options: ["としては", "として", "にとって", "に対して"],
        translation: "就初學者而言，我認為做得很好。"
      }
    ]
  },
  {
    id: "g_n2_013", pattern: "〜に当たって", meaning: "在…之際、在做…的時候", level: "N2",
    connection: "名詞 + に当たって／動詞辞書形 + に当たって",
    explanation: "表示在進行某重要事項時的時機。強調此時機的特殊性，多用於正式場合。",
    choices: [
      {
        sentence: "新年を迎える___、目標を立てた。",
        answer: "に当たって",
        options: ["に当たって", "に際して", "について", "において"],
        translation: "在迎接新年之際，制定了目標。"
      },
      {
        sentence: "卒業___、先生から激励の言葉をいただいた。",
        answer: "に当たって",
        options: ["に当たって", "に対して", "において", "にあって"],
        translation: "在畢業之際，從老師那裡獲得了鼓勵的話語。"
      }
    ]
  },
  {
    id: "g_n2_014", pattern: "〜ものの", meaning: "雖然…但是、儘管…", level: "N2",
    connection: "動詞普通形／い形容詞／な形容詞語幹な + ものの",
    explanation: "表示逆接。前項雖然成立，但後項有與預期不同的結果或情況。",
    choices: [
      {
        sentence: "試験に合格した___、自信は持てなかった。",
        answer: "ものの",
        options: ["ものの", "にもかかわらず", "のに", "が"],
        translation: "雖然通過了考試，但還是沒有自信。"
      },
      {
        sentence: "努力した___、結果につながらなかった。",
        answer: "ものの",
        options: ["ものの", "のに", "にもかかわらず", "けれど"],
        translation: "雖然努力了，但沒有轉化為成果。"
      }
    ]
  },
  {
    id: "g_n2_015", pattern: "〜たとえ〜ても", meaning: "即使…也…", level: "N2",
    connection: "たとえ + 動詞て形／い形容詞くて／な形容詞で + も",
    explanation: "假定某極端情況成立，後項也不受其影響。強調後項的確定性。",
    choices: [
      {
        sentence: "たとえ困難な状況___、諦めない。",
        answer: "でも",
        options: ["でも", "なのに", "のに", "から"],
        translation: "即使處於困難的情況，也不放棄。"
      },
      {
        sentence: "たとえ失敗し___、また挑戦する。",
        answer: "ても",
        options: ["ても", "のに", "ながら", "つつ"],
        translation: "即使失敗了，也要再次挑戰。"
      }
    ]
  },
  {
    id: "g_n2_016", pattern: "〜に応じて", meaning: "根據…、依照…", level: "N2",
    connection: "名詞 + に応じて／に応じた + 名詞",
    explanation: "表示根據情況、要求等作出相應的反應或調整。",
    choices: [
      {
        sentence: "能力___仕事を割り当てる。",
        answer: "に応じて",
        options: ["に応じて", "に基づいて", "によって", "に対して"],
        translation: "根據能力分配工作。"
      },
      {
        sentence: "状況の変化___柔軟に対応する。",
        answer: "に応じて",
        options: ["に応じて", "に伴って", "につれて", "に従って"],
        translation: "根據情況的變化靈活應對。"
      }
    ]
  },
  {
    id: "g_n2_017", pattern: "〜向けに／〜向けの", meaning: "針對…、面向…", level: "N2",
    connection: "名詞 + 向けに／向けの + 名詞",
    explanation: "表示以某對象為目標而製作或設計。",
    choices: [
      {
        sentence: "初心者___のテキストを使っている。",
        answer: "向け",
        options: ["向け", "に対して", "のための", "用の"],
        translation: "使用了針對初學者的教材。"
      },
      {
        sentence: "海外___に商品を輸出している。",
        answer: "向け",
        options: ["向け", "に関して", "に対して", "のため"],
        translation: "向海外出口商品。"
      }
    ]
  },
  {
    id: "g_n2_018", pattern: "〜かねない", meaning: "有可能…、說不定會…（不好的結果）", level: "N2",
    connection: "動詞ます形 + かねない",
    explanation: "表示有可能發生不好的事情。說話者擔心某負面情況可能發生。",
    choices: [
      {
        sentence: "そんな無理をすれば体を壊し___。",
        answer: "かねない",
        options: ["かねない", "かねる", "かねます", "かねて"],
        translation: "那樣勉強的話，說不定會搞壞身體。"
      },
      {
        sentence: "このまま放置すれば大問題になり___。",
        answer: "かねない",
        options: ["かねない", "得ない", "がたい", "にくい"],
        translation: "就這樣放置的話，說不定會變成大問題。"
      }
    ]
  },
  {
    id: "g_n2_019", pattern: "〜かねる", meaning: "難以…、不能…", level: "N2",
    connection: "動詞ます形 + かねる",
    explanation: "表示由於心理上或道義上的原因，難以做某事。比「できない」更加委婉。",
    choices: [
      {
        sentence: "その要求には応じ___。",
        answer: "かねます",
        options: ["かねます", "かねない", "にくいです", "がたいです"],
        translation: "難以回應那個要求。"
      },
      {
        sentence: "責任を持って答え___質問があります。",
        answer: "かねる",
        options: ["かねる", "かねない", "にくい", "づらい"],
        translation: "有難以負責任地回答的問題。"
      }
    ]
  },
  {
    id: "g_n2_020", pattern: "〜に過ぎない", meaning: "不過是…、只不過是…", level: "N2",
    connection: "名詞 + に過ぎない／動詞辞書形 + に過ぎない",
    explanation: "表示程度很低或數量很少，「不過只是這種程度」，含有輕視或謙遜的語氣。",
    choices: [
      {
        sentence: "これはほんの冗談___。",
        answer: "に過ぎない",
        options: ["に過ぎない", "にほかならない", "に違いない", "のみだ"],
        translation: "這不過只是個玩笑而已。"
      },
      {
        sentence: "彼は学生___。なぜそんな期待をするのか。",
        answer: "に過ぎない",
        options: ["に過ぎない", "でしかない", "だけだ", "に過ぎません"],
        translation: "他不過是個學生。為什麼抱那麼大的期望？"
      }
    ]
  },
  // N1 Grammar
  {
    id: "g_n1_001", pattern: "〜にほかならない", meaning: "正是…、不是別的就是…", level: "N1",
    connection: "名詞 + にほかならない",
    explanation: "表示強調，確認地說明原因、理由或本質。比「だ」更有強調效果。",
    choices: [
      {
        sentence: "成功の秘訣は努力___。",
        answer: "にほかならない",
        options: ["にほかならない", "に過ぎない", "に違いない", "であるはずだ"],
        translation: "成功的秘訣正是努力。"
      },
      {
        sentence: "彼の行動は愛国心から___ものだ。",
        answer: "にほかならない",
        options: ["にほかならない", "に過ぎない", "によるものだ", "だとしか言えない"],
        translation: "他的行動正是源於愛國心。"
      }
    ]
  },
  {
    id: "g_n1_002", pattern: "〜をもって", meaning: "以…（手段）、到…為止（時間）", level: "N1",
    connection: "名詞 + をもって",
    explanation: "①以某手段或方法 ②以某時間點為界限結束（書面語）",
    choices: [
      {
        sentence: "今月末___退職いたします。",
        answer: "をもって",
        options: ["をもって", "をもとに", "によって", "をもとにして"],
        translation: "我將在本月底辭職。"
      },
      {
        sentence: "実力___勝負するつもりだ。",
        answer: "をもって",
        options: ["をもって", "によって", "をもとに", "で"],
        translation: "我打算以實力決勝負。"
      }
    ]
  },
  {
    id: "g_n1_003", pattern: "〜ともなると", meaning: "一旦成為…、到了…（的程度）", level: "N1",
    connection: "名詞 + ともなると／ともなれば",
    explanation: "表示到達某個較高的地位、程度或重要場合時，必然會有某種結果或要求。",
    choices: [
      {
        sentence: "社長___、責任も格段に大きくなる。",
        answer: "ともなると",
        options: ["ともなると", "になると", "となれば", "ともなれば"],
        translation: "一旦成為社長，責任也會大幅增加。"
      },
      {
        sentence: "この規模のプロジェクト___、専門家の協力が必要だ。",
        answer: "ともなると",
        options: ["ともなると", "になると", "においては", "のためには"],
        translation: "到了這個規模的專案，就需要專家的協助。"
      }
    ]
  },
  {
    id: "g_n1_004", pattern: "〜いかんによっては", meaning: "根據…的如何、取決於…", level: "N1",
    connection: "名詞 + いかんによっては／いかんで",
    explanation: "表示結果取決於前項的情況或內容。書面語，正式表達。",
    choices: [
      {
        sentence: "結果___、計画を変更する必要がある。",
        answer: "いかんによっては",
        options: ["いかんによっては", "によっては", "次第では", "如何では"],
        translation: "根據結果如何，可能需要變更計畫。"
      },
      {
        sentence: "対応の仕方___問題が大きくなる恐れがある。",
        answer: "いかんによっては",
        options: ["いかんによっては", "によって", "次第で", "如何で"],
        translation: "根據應對方式的如何，有可能讓問題變大。"
      }
    ]
  },
  {
    id: "g_n1_005", pattern: "〜をよそに", meaning: "不顧…、無視…", level: "N1",
    connection: "名詞 + をよそに",
    explanation: "表示無視他人的感受、期待或周圍的狀況，自顧自地做某事。含有批評語氣。",
    choices: [
      {
        sentence: "周囲の心配___、彼は危険な山に登り続けた。",
        answer: "をよそに",
        options: ["をよそに", "にもかかわらず", "をものともせず", "を無視して"],
        translation: "不顧周圍人的擔憂，他繼續登危險的山。"
      },
      {
        sentence: "親の期待___、彼は芸術の道を選んだ。",
        answer: "をよそに",
        options: ["をよそに", "にもかかわらず", "に背いて", "を無視して"],
        translation: "不顧父母的期望，他選擇了藝術之路。"
      }
    ]
  },
  {
    id: "g_n1_006", pattern: "〜にあって", meaning: "在…（狀況）中", level: "N1",
    connection: "名詞 + にあって",
    explanation: "書面語。強調在某種特殊狀況或環境中。",
    choices: [
      {
        sentence: "困難な状況___、彼は冷静さを保った。",
        answer: "にあって",
        options: ["にあって", "において", "にもかかわらず", "にあっても"],
        translation: "在困難的狀況中，他保持了冷靜。"
      },
      {
        sentence: "現代社会___、人々の絆が薄れている。",
        answer: "にあって",
        options: ["にあって", "において", "にとって", "にあっては"],
        translation: "在現代社會中，人們的紐帶正在淡化。"
      }
    ]
  },
  {
    id: "g_n1_007", pattern: "〜ならではの", meaning: "只有…才有的、…特有的", level: "N1",
    connection: "名詞 + ならではの + 名詞",
    explanation: "表示只有那個特定的人、物或場所才有的、特有的性質或優點。",
    choices: [
      {
        sentence: "これは日本___おもてなし文化だ。",
        answer: "ならではの",
        options: ["ならではの", "にしかない", "だけの", "ならの"],
        translation: "這是只有日本才有的款待文化。"
      },
      {
        sentence: "プロ___技術が観客を魅了した。",
        answer: "ならではの",
        options: ["ならではの", "だけの", "のみの", "ならの"],
        translation: "只有職業選手才有的技術吸引了觀眾。"
      }
    ]
  },
  {
    id: "g_n1_008", pattern: "〜を皮切りに", meaning: "以…為開端、從…開始", level: "N1",
    connection: "名詞 + を皮切りに（して）",
    explanation: "以某事為最初的契機，之後逐漸展開。含有「從這裡開始連鎖擴大」的意思。",
    choices: [
      {
        sentence: "東京公演___、全国ツアーが始まった。",
        answer: "を皮切りに",
        options: ["を皮切りに", "を始めとして", "から始まり", "を機に"],
        translation: "以東京公演為開端，全國巡迴演出開始了。"
      },
      {
        sentence: "この一件___、改革の機運が高まった。",
        answer: "を皮切りに",
        options: ["を皮切りに", "をきっかけに", "を機に", "から"],
        translation: "以這件事為開端，改革的氣勢高漲了。"
      }
    ]
  },
  {
    id: "g_n1_009", pattern: "〜に即して", meaning: "根據…、切合…", level: "N1",
    connection: "名詞 + に即して／に即した + 名詞",
    explanation: "表示根據實際情況、現實、具體事例等來思考或行動。",
    choices: [
      {
        sentence: "現実___考える必要がある。",
        answer: "に即して",
        options: ["に即して", "に基づいて", "に従って", "に沿って"],
        translation: "需要根據現實來思考。"
      },
      {
        sentence: "事実___の報告を求める。",
        answer: "に即した",
        options: ["に即した", "に基づいた", "に従った", "に即しての"],
        translation: "要求根據事實的報告。"
      }
    ]
  },
  {
    id: "g_n1_010", pattern: "〜ともあろう（者）が", meaning: "身為…（居然）…", level: "N1",
    connection: "名詞 + ともあろう（者）が",
    explanation: "表示「以那樣地位或資格的人，居然做出了如此失格的事」，帶有批評或驚訝的語氣。",
    choices: [
      {
        sentence: "専門家___、そんな基本的なミスをするとは。",
        answer: "ともあろう者が",
        options: ["ともあろう者が", "である以上は", "にもかかわらず", "だから"],
        translation: "身為專家，居然犯那種基本錯誤。"
      },
      {
        sentence: "教師___、学生に暴言を吐くとは許せない。",
        answer: "ともあろう者が",
        options: ["ともあろう者が", "のくせに", "にもかかわらず", "であるのに"],
        translation: "身為教師，居然對學生口出惡言，不可饒恕。"
      }
    ]
  },
  {
    id: "g_n1_011", pattern: "〜とあっては", meaning: "如果是…的話（就沒辦法了）", level: "N1",
    connection: "名詞 + とあっては／動詞普通形 + とあっては",
    explanation: "表示在某特殊情況下，後項是理所當然或不得不的結果。",
    choices: [
      {
        sentence: "病気___、仕事を休むのは仕方がない。",
        answer: "とあっては",
        options: ["とあっては", "だから", "ならば", "とすれば"],
        translation: "如果是生病的話，休息不工作也是沒辦法的事。"
      },
      {
        sentence: "先生に頼まれた___、断れない。",
        answer: "とあっては",
        options: ["とあっては", "からには", "ならば", "となると"],
        translation: "如果是被老師拜託的話，就無法拒絕了。"
      }
    ]
  },
  {
    id: "g_n1_012", pattern: "〜ずにはおかない", meaning: "必然會…、不得不…", level: "N1",
    connection: "動詞ない形（去ない）+ ずにはおかない",
    explanation: "表示必然會產生某種強烈反應，或說話者強烈的意志。",
    choices: [
      {
        sentence: "この映画は観る者を感動させ___。",
        answer: "ずにはおかない",
        options: ["ずにはおかない", "ずにはいられない", "ないではいられない", "てしまう"],
        translation: "這部電影必然會讓觀看的人感動。"
      },
      {
        sentence: "不正を見たら糾弾せ___。",
        answer: "ずにはおかない",
        options: ["ずにはおかない", "ずにはいられない", "ないわけにはいかない", "なければならない"],
        translation: "看到不正當行為，就必然會加以糾彈。"
      }
    ]
  },
  {
    id: "g_n1_013", pattern: "〜ないではおかない", meaning: "必然會…（感情上）", level: "N1",
    connection: "動詞ない形 + ないではおかない",
    explanation: "表示某事物的力量強大，必然引發某種情感反應。語感比「ずにはおかない」更自然。",
    choices: [
      {
        sentence: "彼の演技は観客を笑わせ___。",
        answer: "ないではおかない",
        options: ["ないではおかない", "ないではいられない", "ずにはおかない", "てしまう"],
        translation: "他的演技必然讓觀眾發笑。"
      },
      {
        sentence: "その事実は人々を驚かせ___。",
        answer: "ないではおかない",
        options: ["ないではおかない", "ずにはいられない", "ずにはおかない", "てしまう"],
        translation: "那個事實必然讓人們驚訝。"
      }
    ]
  },
  {
    id: "g_n1_014", pattern: "〜ことなしに", meaning: "不…就（不能）…", level: "N1",
    connection: "動詞辞書形 + ことなしに",
    explanation: "表示不做前項就無法實現後項。強調前項是後項的必要條件。",
    choices: [
      {
        sentence: "努力する___、成功は望めない。",
        answer: "ことなしに",
        options: ["ことなしに", "ことなく", "なしに", "ないで"],
        translation: "不努力的話，就不能期望成功。"
      },
      {
        sentence: "相手を理解する___、良い関係は築けない。",
        answer: "ことなしに",
        options: ["ことなしに", "ことなく", "なしには", "ないまま"],
        translation: "不理解對方的話，就無法建立良好關係。"
      }
    ]
  },
  {
    id: "g_n1_015", pattern: "〜べく", meaning: "為了…（而）", level: "N1",
    connection: "動詞辞書形 + べく（するべく→すべく）",
    explanation: "書面語。表示為了達成某目的的目的表現。比「〜ために」更正式。",
    choices: [
      {
        sentence: "夢を実現す___、毎日練習している。",
        answer: "べく",
        options: ["べく", "ために", "ように", "ため"],
        translation: "為了實現夢想，每天練習著。"
      },
      {
        sentence: "問題を解決す___、専門家に相談した。",
        answer: "べく",
        options: ["べく", "ため", "ように", "として"],
        translation: "為了解決問題，諮詢了專家。"
      }
    ]
  },
  {
    id: "g_n1_016", pattern: "〜が最後", meaning: "一旦…就（不好的結果）", level: "N1",
    connection: "動詞た形 + が最後",
    explanation: "表示一旦做了前項，後項就必然發生（通常是不好的或難以收拾的結果）。",
    choices: [
      {
        sentence: "彼女が話し始めた___、誰も止められない。",
        answer: "が最後",
        options: ["が最後", "からには", "以上は", "となっては"],
        translation: "一旦她開始說話，誰也阻止不了。"
      },
      {
        sentence: "この秘密を知った___、ただでは済まない。",
        answer: "が最後",
        options: ["が最後", "からには", "からは", "とあっては"],
        translation: "一旦知道了這個秘密，就不會就這樣算了。"
      }
    ]
  },
  {
    id: "g_n1_017", pattern: "〜といい〜といい", meaning: "不管是…還是…（都）", level: "N1",
    connection: "名詞 + といい + 名詞 + といい",
    explanation: "舉出兩個代表性例子，說明整體的評價。",
    choices: [
      {
        sentence: "味___見た目___、この料理は完璧だ。",
        answer: "といい〜といい",
        options: ["といい〜といい", "にしろ〜にしろ", "でも〜でも", "にせよ〜にせよ"],
        translation: "不管是味道還是外觀，這道料理都是完美的。"
      },
      {
        sentence: "デザイン___機能性___、このスマホは最高だ。",
        answer: "といい〜といい",
        options: ["といい〜といい", "も〜も", "にしろ〜にしろ", "でも〜でも"],
        translation: "不管是設計還是功能性，這支智慧型手機都是最棒的。"
      }
    ]
  },
  {
    id: "g_n1_018", pattern: "〜とはいえ", meaning: "雖說…但是", level: "N1",
    connection: "名詞／動詞普通形／い形容詞／な形容詞 + とはいえ",
    explanation: "承認前項的事實，但後項提出相反或有限制的內容。比「とはいっても」更正式。",
    choices: [
      {
        sentence: "春___、まだ寒い日が続いている。",
        answer: "とはいえ",
        options: ["とはいえ", "にもかかわらず", "ものの", "といっても"],
        translation: "雖說是春天，但寒冷的日子還在持續。"
      },
      {
        sentence: "失敗した___、諦めるつもりはない。",
        answer: "とはいえ",
        options: ["とはいえ", "ものの", "にもかかわらず", "からといって"],
        translation: "雖說失敗了，但我不打算放棄。"
      }
    ]
  },
  {
    id: "g_n1_019", pattern: "〜かたわら", meaning: "一邊…（的同時）、在…的傍邊", level: "N1",
    connection: "動詞辞書形 + かたわら／名詞の + かたわら",
    explanation: "表示在從事主要工作的同時，也做另一件事。兩件事同時進行。",
    choices: [
      {
        sentence: "本業の___、副業として執筆活動をしている。",
        answer: "かたわら",
        options: ["かたわら", "傍ら", "一方で", "合間に"],
        translation: "在從事本業的同時，也做副業寫作活動。"
      },
      {
        sentence: "研究する___、後進の指導にも力を注いでいる。",
        answer: "かたわら",
        options: ["かたわら", "一方で", "ながら", "合間に"],
        translation: "在進行研究的同時，也致力於指導後進。"
      }
    ]
  },
  {
    id: "g_n1_020", pattern: "〜に足る", meaning: "值得…、足以…", level: "N1",
    connection: "動詞辞書形 + に足る／名詞 + に足る",
    explanation: "書面語。表示具備了值得做某事的資格或程度。常與「信頼に足る」等固定搭配使用。",
    choices: [
      {
        sentence: "彼は信頼する___人物だ。",
        answer: "に足る",
        options: ["に足る", "に値する", "べき", "に当たる"],
        translation: "他是值得信任的人物。"
      },
      {
        sentence: "これは記念する___出来事だ。",
        answer: "に足る",
        options: ["に足る", "に値する", "べき", "に当たる"],
        translation: "這是值得紀念的事件。"
      }
    ]
  },
];

// Export for use in app
if (typeof module !== 'undefined') module.exports = GRAMMAR_DATA;
