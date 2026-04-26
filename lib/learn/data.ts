/**
 * Hardcoded learning journeys data for Finasaan.
 * Covers PSX basics, mutual funds, and financial literacy.
 * Includes InvestKaar YouTube playlist videos.
 */

import type { LearningJourney } from "./types";

// ====================================================================
//  JOURNEY 1: Stock Market Basics
// ====================================================================

const stockMarketBasics: LearningJourney = {
  id: "stock-market-basics",
  title: "Stock Market Basics",
  description:
    "Learn how the Pakistan Stock Exchange works — from opening a brokerage account to understanding price movements.",
  difficulty: "beginner",
  category: "stocks",
  estimatedMinutes: 90,
  coverColor: "#159F63",
  icon: "chart",
  modules: [
    {
      id: "smb-intro",
      journeyId: "stock-market-basics",
      title: "What Is the Stock Market?",
      description: "Understand what stocks are and how exchanges work.",
      order: 1,
      lessons: [
        {
          id: "smb-intro-1",
          moduleId: "smb-intro",
          title: "Stocks, Shares & Ownership",
          order: 1,
          estimatedMinutes: 8,
          content: [
            {
              type: "heading",
              content: "What Is a Stock?",
            },
            {
              type: "text",
              content:
                "A stock (or share) represents a tiny piece of ownership in a company. When you buy a share of, say, Engro Corporation, you literally become a part-owner of that company. If the company does well, the value of your share goes up. If it pays out profits, you receive a portion as dividends.",
            },
            {
              type: "text",
              content:
                "The Pakistan Stock Exchange (PSX) is the country's primary stock exchange, headquartered in Karachi. It was formed in 2016 by merging the Karachi, Lahore, and Islamabad stock exchanges. Today, over 500 companies are listed on PSX.",
            },
            {
              type: "callout",
              variant: "info",
              content:
                "PSX is regulated by the Securities and Exchange Commission of Pakistan (SECP). All brokers must be SECP-licensed.",
            },
            {
              type: "video",
              youtubeId: "RUv0qqzrbK0",
              title:
                "Lets IPO this Channel on PSX — Valuation, Book Building, Reverse listing",
            },
            {
              type: "keyTakeaway",
              items: [
                "A stock is a unit of ownership in a company.",
                "PSX is Pakistan's unified stock exchange with 500+ listed companies.",
                "SECP regulates the market and all brokers.",
              ],
            },
          ],
        },
        {
          id: "smb-intro-2",
          moduleId: "smb-intro",
          title: "How to Open a Brokerage Account",
          order: 2,
          estimatedMinutes: 10,
          content: [
            {
              type: "heading",
              content: "Getting Started with a Broker",
            },
            {
              type: "text",
              content:
                "To buy and sell stocks on PSX, you need a brokerage account. A broker acts as your middleman — they execute trades on your behalf. In Pakistan, you can open an account with SECP-licensed brokers like AKD Securities, Topline Securities, JS Global, and many others.",
            },
            {
              type: "list",
              ordered: true,
              items: [
                "Choose an SECP-licensed broker (check the PSX website for the full list).",
                "Submit your CNIC copy, bank statement, and passport-size photo.",
                "Complete the account opening form (many brokers now offer online KYC).",
                "Fund your account via bank transfer.",
                "Start trading through the broker's online platform or app.",
              ],
            },
            {
              type: "callout",
              variant: "tip",
              content:
                "Look for brokers that offer low commission rates and a user-friendly mobile app. Many now charge as low as 0.15% per trade.",
            },
            {
              type: "video",
              youtubeId: "vosKXx7Q6gQ",
              title:
                "Part 2: From How to find the best broker to opening stock market account",
            },
            {
              type: "keyTakeaway",
              items: [
                "You need a brokerage account to trade on PSX.",
                "Only use SECP-licensed brokers.",
                "Account opening requires CNIC, bank statement, and a photo.",
                "Most brokers now offer online/digital onboarding.",
              ],
            },
          ],
        },
      ],
      quiz: {
        id: "smb-intro-quiz",
        moduleId: "smb-intro",
        title: "Test Your Knowledge: Stock Market Basics",
        passingScore: 60,
        questions: [
          {
            id: "q1",
            question: "What does owning a stock mean?",
            options: [
              "You have lent money to the company",
              "You own a small part of the company",
              "You are an employee of the company",
              "You have a fixed deposit with the company",
            ],
            correctIndex: 1,
            explanation:
              "A stock represents partial ownership in a company. You become a shareholder.",
          },
          {
            id: "q2",
            question: "Which body regulates the Pakistan Stock Exchange?",
            options: [
              "State Bank of Pakistan (SBP)",
              "Federal Board of Revenue (FBR)",
              "Securities and Exchange Commission of Pakistan (SECP)",
              "Pakistan Telecommunication Authority (PTA)",
            ],
            correctIndex: 2,
            explanation:
              "SECP is the regulatory authority for capital markets in Pakistan.",
          },
          {
            id: "q3",
            question:
              "What is the first step to start investing in stocks on PSX?",
            options: [
              "Download a trading app",
              "Open an account with an SECP-licensed broker",
              "Buy shares directly from the company",
              "Contact the stock exchange office",
            ],
            correctIndex: 1,
            explanation:
              "You must open a brokerage account with an SECP-licensed broker before you can trade.",
          },
        ],
      },
    },
    {
      id: "smb-strategy",
      journeyId: "stock-market-basics",
      title: "Investment Strategies",
      description:
        "Learn the difference between growth and dividend stocks, and build your first strategy.",
      order: 2,
      lessons: [
        {
          id: "smb-strat-1",
          moduleId: "smb-strategy",
          title: "Growth vs Dividend Stocks",
          order: 1,
          estimatedMinutes: 10,
          content: [
            {
              type: "heading",
              content: "Two Ways to Make Money in Stocks",
            },
            {
              type: "text",
              content:
                "There are two primary ways to earn returns from stocks: capital gains (the stock price going up) and dividends (the company sharing its profits with you). Some companies focus on growing rapidly, reinvesting profits — these are growth stocks. Others distribute regular profits — these are dividend stocks.",
            },
            {
              type: "text",
              content:
                "In the PSX context, large banks like HBL and MCB are known for consistent dividends. On the other hand, tech-adjacent companies or newer listings may offer higher growth potential but lower or no dividends.",
            },
            {
              type: "video",
              youtubeId: "IznETOMmwQw",
              title:
                "Interest rates going up? Impact on growth vs dividends stocks?",
            },
            {
              type: "callout",
              variant: "info",
              content:
                "When interest rates rise, dividend stocks become relatively less attractive because fixed-income alternatives (like government bonds) offer competitive returns with lower risk.",
            },
            {
              type: "keyTakeaway",
              items: [
                "Growth stocks: higher potential return, more risk, reinvest profits.",
                "Dividend stocks: regular income, lower volatility, profit distribution.",
                "Interest rate changes affect the relative attractiveness of both.",
              ],
            },
          ],
        },
        {
          id: "smb-strat-2",
          moduleId: "smb-strategy",
          title: "Building a Winning Strategy in Your 20s",
          order: 2,
          estimatedMinutes: 8,
          content: [
            {
              type: "heading",
              content: "Start Early, Stay Consistent",
            },
            {
              type: "text",
              content:
                "The biggest advantage young investors have is time. Thanks to the power of compounding, even small regular investments can grow into significant wealth over 20-30 years. The key is to start early, invest consistently, and resist the urge to time the market.",
            },
            {
              type: "list",
              items: [
                "Set aside a fixed amount each month — even PKR 5,000 counts.",
                "Diversify across sectors: don't put everything in one stock.",
                "Reinvest dividends to accelerate compounding.",
                "Keep a long-term horizon (5+ years minimum).",
                "Avoid panic selling during market dips.",
              ],
            },
            {
              type: "video",
              youtubeId: "hmru0vk0jNo",
              title: "Use this strategy to INVEST and WIN in your 20s!",
            },
            {
              type: "keyTakeaway",
              items: [
                "Time in the market beats timing the market.",
                "Consistency and discipline matter more than picking the 'right' stock.",
                "Reinvesting dividends accelerates wealth creation.",
              ],
            },
          ],
        },
        {
          id: "smb-strat-3",
          moduleId: "smb-strategy",
          title: "Common Mistakes to Avoid",
          order: 3,
          estimatedMinutes: 7,
          content: [
            {
              type: "heading",
              content: "Three Mistakes That Erase Your Profits",
            },
            {
              type: "text",
              content:
                "Even experienced investors make mistakes. For beginners, the most damaging errors usually involve emotional decision-making, poor risk management, and following unverified tips. Let's look at the three biggest profit killers.",
            },
            {
              type: "list",
              ordered: true,
              items: [
                "Panic selling during a dip — markets recover, but you lock in losses by selling.",
                "Going all-in on a single stock based on a 'tip' — diversification is your best defense.",
                "Ignoring transaction costs and taxes — they eat into returns, especially for frequent traders.",
              ],
            },
            {
              type: "video",
              youtubeId: "NEBEcqQzXtI",
              title: "3 mistakes that will take away all the profits",
            },
            {
              type: "callout",
              variant: "warning",
              content:
                "Never invest money you cannot afford to lose. Stock markets can be volatile in the short term.",
            },
            {
              type: "keyTakeaway",
              items: [
                "Don't panic sell — have a plan and stick to it.",
                "Never put all your money in one stock.",
                "Factor in brokerage fees and capital gains tax.",
              ],
            },
          ],
        },
      ],
      quiz: {
        id: "smb-strategy-quiz",
        moduleId: "smb-strategy",
        title: "Test Your Knowledge: Investment Strategies",
        passingScore: 60,
        questions: [
          {
            id: "q1",
            question:
              "What is the main advantage of starting to invest in your 20s?",
            options: [
              "Lower tax rates for young investors",
              "More time for compounding to work",
              "Access to exclusive investment products",
              "Guaranteed higher returns",
            ],
            correctIndex: 1,
            explanation:
              "Time is the most powerful factor in compounding. Starting early gives your investments more years to grow exponentially.",
          },
          {
            id: "q2",
            question:
              "Which type of stock typically provides regular income to shareholders?",
            options: [
              "Growth stocks",
              "Penny stocks",
              "Dividend stocks",
              "IPO stocks",
            ],
            correctIndex: 2,
            explanation:
              "Dividend stocks distribute a portion of company profits to shareholders, providing regular income.",
          },
          {
            id: "q3",
            question: "What should you do during a market dip?",
            options: [
              "Sell everything immediately to cut losses",
              "Buy more of the same stock regardless",
              "Stick to your long-term plan and avoid panic decisions",
              "Stop checking your portfolio forever",
            ],
            correctIndex: 2,
            explanation:
              "Panic selling locks in losses. Having a long-term plan and sticking to it is the best approach during market volatility.",
          },
          {
            id: "q4",
            question: "Why is diversification important?",
            options: [
              "It guarantees profits",
              "It reduces the impact of any single stock's poor performance",
              "It eliminates all risk",
              "It is required by SECP regulation",
            ],
            correctIndex: 1,
            explanation:
              "Diversification spreads risk across multiple investments, reducing the impact if one stock performs poorly.",
          },
        ],
      },
    },
    {
      id: "smb-payouts",
      journeyId: "stock-market-basics",
      title: "Understanding Payouts",
      description:
        "Learn about dividends, right shares, and bonus shares on PSX.",
      order: 3,
      lessons: [
        {
          id: "smb-pay-1",
          moduleId: "smb-payouts",
          title: "Types of Payouts",
          order: 1,
          estimatedMinutes: 10,
          content: [
            {
              type: "heading",
              content: "How Companies Reward Shareholders",
            },
            {
              type: "text",
              content:
                "When a company listed on PSX makes profits, it can distribute them to shareholders in several ways. Understanding these payout mechanisms is crucial for evaluating which stocks to buy and hold.",
            },
            {
              type: "list",
              items: [
                "Cash Dividends — direct cash payments per share (e.g., Rs. 5 per share).",
                "Bonus Shares — free additional shares proportional to your holdings (e.g., 1 bonus share for every 10 you own).",
                "Right Shares — option to buy additional shares at a discounted price.",
              ],
            },
            {
              type: "video",
              youtubeId: "6LjhLWLn1I4",
              title: "Which payout is the best?",
            },
            {
              type: "video",
              youtubeId: "KvioAwFsa5U",
              title: "Which payout is the best? Part 2",
            },
            {
              type: "callout",
              variant: "tip",
              content:
                "Dividend yield = (Annual Dividend per Share / Current Price) x 100. A yield above 5% is generally considered good in Pakistan's market.",
            },
            {
              type: "keyTakeaway",
              items: [
                "Companies can pay out via cash dividends, bonus shares, or right shares.",
                "Cash dividends provide immediate income.",
                "Bonus shares increase your holdings without additional cost.",
                "Right shares let you buy more at a discount — but require additional capital.",
              ],
            },
          ],
        },
      ],
      quiz: {
        id: "smb-payouts-quiz",
        moduleId: "smb-payouts",
        title: "Test Your Knowledge: Payouts",
        passingScore: 60,
        questions: [
          {
            id: "q1",
            question: "What is a bonus share?",
            options: [
              "A share you buy at a premium",
              "A free additional share given proportional to your holdings",
              "A share given only to company employees",
              "A share you receive when a company goes bankrupt",
            ],
            correctIndex: 1,
            explanation:
              "Bonus shares are free shares distributed to existing shareholders proportional to their holdings.",
          },
          {
            id: "q2",
            question:
              "If a stock costs Rs. 100 and pays Rs. 7 in annual dividends, what is the dividend yield?",
            options: ["5%", "7%", "10%", "0.7%"],
            correctIndex: 1,
            explanation:
              "Dividend yield = (7 / 100) x 100 = 7%.",
          },
          {
            id: "q3",
            question: "What are right shares?",
            options: [
              "Shares given for free to all investors",
              "The right to sell shares at market price",
              "An option to buy additional shares at a discounted price",
              "Shares that can only be bought on Fridays",
            ],
            correctIndex: 2,
            explanation:
              "Right shares give existing shareholders the option to purchase more shares at a price below the market rate.",
          },
        ],
      },
    },
    {
      id: "smb-investing",
      journeyId: "stock-market-basics",
      title: "Taking Action",
      description: "Ready to invest? Let's open an account and place your first order.",
      order: 4,
      lessons: [
        {
          id: "smb-inv-1",
          moduleId: "smb-investing",
          title: "Step-by-Step Investing Flow",
          order: 1,
          estimatedMinutes: 12,
          content: [
            {
              type: "heading",
              content: "From Account Opening to Order Execution"
            },
            {
              type: "text",
              content: "Investing in PSX is a structured process involving three main entities: the Broker, the CDC (Central Depository Company), and the NCCPL (National Clearing Company of Pakistan Limited). Don't worry, most of this is handled automatically through your broker's platform."
            },
            {
              type: "video",
              youtubeId: "V6h7C_P1f8I",
              title: "Step-by-Step Investing in Pakistan"
            },
            {
              type: "list",
              ordered: true,
              items: [
                "Select a broker and open a trading account.",
                "Your CDC sub-account is created (where your shares are safely stored).",
                "Transfer funds to your brokerage account.",
                "Place a 'Buy' order via your broker's terminal or app.",
                "NCCPL handles the clearing and settlement on a T+2 basis (Trade Day + 2 Business Days)."
              ]
            },
            {
              type: "keyTakeaway",
              items: [
                "CDC is the digital 'safe' for your shares.",
                "T+2 is the standard settlement cycle in Pakistan.",
                "Modern apps like Finasaan make the flow seamless."
              ]
            }
          ]
        }
      ],
      quiz: {
        id: "smb-investing-quiz",
        moduleId: "smb-investing",
        title: "Test Your Knowledge: Investing Process",
        passingScore: 60,
        questions: [
          {
            id: "q1",
            question: "What does CDC stand for in the Pakistan Stock Market?",
            options: [
              "Central Data Center",
              "Central Depository Company",
              "Capital Development Controller",
              "Common Dividend Council"
            ],
            correctIndex: 1,
            explanation: "CDC (Central Depository Company) is the institution that holds your shares electronically."
          },
          {
            id: "q2",
            question: "What is the standard settlement cycle at PSX?",
            options: ["Same day", "T+1", "T+2", "T+5"],
            correctIndex: 2,
            explanation: "T+2 means your trade is settled two business days after the execution date."
          }
        ]
      }
    }
  ],
};

// ====================================================================
//  JOURNEY 2: Mutual Funds Mastery
// ====================================================================

const mutualFundsMastery: LearningJourney = {
  id: "mutual-funds-mastery",
  title: "Mutual Funds Mastery",
  description:
    "Understand how mutual funds work in Pakistan, the different types available, and how to pick the right one for your goals.",
  difficulty: "beginner",
  category: "mutual-funds",
  estimatedMinutes: 60,
  coverColor: "#6366F1",
  icon: "coin",
  modules: [
    {
      id: "mfm-intro",
      journeyId: "mutual-funds-mastery",
      title: "Introduction to Mutual Funds",
      description:
        "What mutual funds are, how they pool money, and why they're great for beginners.",
      order: 1,
      lessons: [
        {
          id: "mfm-intro-1",
          moduleId: "mfm-intro",
          title: "What Is a Mutual Fund?",
          order: 1,
          estimatedMinutes: 8,
          content: [
            {
              type: "heading",
              content: "Pooling Money for Better Returns",
            },
            {
              type: "text",
              content:
                "A mutual fund pools money from many investors to invest in a diversified portfolio of stocks, bonds, or other securities. A professional fund manager makes the investment decisions on your behalf. In Pakistan, mutual funds are managed by Asset Management Companies (AMCs) regulated by SECP.",
            },
            {
              type: "text",
              content:
                "Think of it like a group order at a restaurant — everyone chips in, and a professional chef (the fund manager) decides what dishes to order. You get access to a diverse meal without having to research every ingredient yourself.",
            },
            {
              type: "list",
              items: [
                "Professional management — experts handle your money.",
                "Diversification — your investment is spread across many securities.",
                "Low minimum — you can start with as little as PKR 500 in some funds.",
                "Liquidity — you can redeem your investment on any business day.",
                "Regulated — SECP and MUFAP oversight ensure transparency.",
              ],
            },
            {
              type: "callout",
              variant: "info",
              content:
                "Pakistan has over 20 AMCs managing hundreds of mutual fund schemes. MUFAP (Mutual Funds Association of Pakistan) publishes daily NAV data for all funds.",
            },
            {
              type: "keyTakeaway",
              items: [
                "Mutual funds pool investor money for professional management.",
                "They offer diversification, even with small amounts.",
                "AMCs in Pakistan are regulated by SECP.",
                "NAV (Net Asset Value) is the per-unit price of the fund.",
              ],
            },
          ],
        },
        {
          id: "mfm-intro-2",
          moduleId: "mfm-intro",
          title: "Types of Mutual Funds in Pakistan",
          order: 2,
          estimatedMinutes: 10,
          content: [
            {
              type: "heading",
              content: "Choosing the Right Fund Type",
            },
            {
              type: "text",
              content:
                "Pakistani mutual funds come in several categories based on what they invest in. Choosing the right type depends on your risk tolerance, investment horizon, and financial goals.",
            },
            {
              type: "list",
              items: [
                "Money Market Funds — invest in short-term government securities. Lowest risk, modest returns. Good for parking emergency funds.",
                "Income/Bond Funds — invest in government and corporate bonds. Low-to-moderate risk, steady income.",
                "Balanced Funds — mix of stocks and bonds. Moderate risk, balanced growth and income.",
                "Equity Funds — invest primarily in stocks. Higher risk, higher potential returns. Best for long-term goals.",
                "Islamic Funds — Shariah-compliant versions of all the above. Avoid interest-based instruments.",
                "Fund of Funds — invest in other mutual funds. Offer diversification across fund types.",
              ],
            },
            {
              type: "callout",
              variant: "tip",
              content:
                "If you're new to investing, start with a money market fund for your emergency savings, then gradually allocate to equity funds for long-term growth.",
            },
            {
              type: "keyTakeaway",
              items: [
                "Money market funds = lowest risk, equity funds = highest potential return.",
                "Islamic/Shariah-compliant options are available for every fund type.",
                "Match the fund type to your risk tolerance and time horizon.",
              ],
            },
          ],
        },
      ],
      quiz: {
        id: "mfm-intro-quiz",
        moduleId: "mfm-intro",
        title: "Test Your Knowledge: Mutual Fund Basics",
        passingScore: 60,
        questions: [
          {
            id: "q1",
            question: "What does NAV stand for?",
            options: [
              "Net Annual Value",
              "Net Asset Value",
              "National Average Yield",
              "Nominal Asset Volume",
            ],
            correctIndex: 1,
            explanation:
              "NAV (Net Asset Value) is the per-unit price of a mutual fund, calculated daily.",
          },
          {
            id: "q2",
            question:
              "Which type of mutual fund is generally considered the safest?",
            options: [
              "Equity Fund",
              "Balanced Fund",
              "Money Market Fund",
              "Fund of Funds",
            ],
            correctIndex: 2,
            explanation:
              "Money market funds invest in short-term government securities and carry the lowest risk.",
          },
          {
            id: "q3",
            question: "Who manages mutual funds in Pakistan?",
            options: [
              "State Bank of Pakistan",
              "Individual investors",
              "Asset Management Companies (AMCs)",
              "Commercial banks directly",
            ],
            correctIndex: 2,
            explanation:
              "AMCs (Asset Management Companies) are licensed by SECP to manage mutual fund schemes.",
          },
        ],
      },
    },
    {
      id: "mfm-picking",
      journeyId: "mutual-funds-mastery",
      title: "How to Pick a Mutual Fund",
      description:
        "Evaluate fund performance, expense ratios, and risk to make informed choices.",
      order: 2,
      lessons: [
        {
          id: "mfm-pick-1",
          moduleId: "mfm-picking",
          title: "Evaluating Fund Performance",
          order: 1,
          estimatedMinutes: 10,
          content: [
            {
              type: "heading",
              content: "Looking Beyond Past Returns",
            },
            {
              type: "text",
              content:
                "When choosing a mutual fund, many investors make the mistake of picking the fund with the highest recent returns. While past performance matters, it doesn't guarantee future results. Here's what you should actually look at:",
            },
            {
              type: "list",
              ordered: true,
              items: [
                "Consistency — does the fund consistently outperform its benchmark index (e.g., KSE-100) over 3-5 years?",
                "Expense Ratio — the annual fee charged by the AMC. Lower is better. A 1% difference compounds significantly over time.",
                "Fund Size (AUM) — Assets Under Management. Very small funds may have liquidity risks.",
                "Fund Manager Track Record — research the manager's history across multiple market cycles.",
                "Risk Metrics — look at standard deviation and Sharpe ratio. Higher Sharpe = better risk-adjusted returns.",
              ],
            },
            {
              type: "callout",
              variant: "warning",
              content:
                "A fund that returned 30% last year might have lost 20% the year before. Always check multi-year performance, not just the most recent period.",
            },
            {
              type: "keyTakeaway",
              items: [
                "Past performance alone is not a reliable indicator.",
                "Check expense ratio, consistency, AUM, and risk metrics.",
                "Compare against the benchmark (KSE-100 for equity funds).",
                "A good Sharpe ratio means better risk-adjusted returns.",
              ],
            },
          ],
        },
      ],
      quiz: {
        id: "mfm-picking-quiz",
        moduleId: "mfm-picking",
        title: "Test Your Knowledge: Picking Funds",
        passingScore: 60,
        questions: [
          {
            id: "q1",
            question: "What is the expense ratio?",
            options: [
              "The ratio of stocks to bonds in a fund",
              "The annual fee charged by the AMC for managing the fund",
              "The minimum investment required",
              "The percentage of profits distributed as dividends",
            ],
            correctIndex: 1,
            explanation:
              "The expense ratio is the annual management fee expressed as a percentage of assets. It reduces your returns.",
          },
          {
            id: "q2",
            question: "What does AUM stand for?",
            options: [
              "Annual Unit Markup",
              "Assets Under Management",
              "Average Underlying Market",
              "Accumulated Unrealized Money",
            ],
            correctIndex: 1,
            explanation:
              "AUM (Assets Under Management) represents the total market value of all investments managed by the fund.",
          },
          {
            id: "q3",
            question:
              "When evaluating a fund, over how many years should you check performance?",
            options: [
              "1 month",
              "6 months",
              "3-5 years minimum",
              "Only the most recent year",
            ],
            correctIndex: 2,
            explanation:
              "A 3-5 year track record gives you a better picture of how the fund performs across different market conditions.",
          },
        ],
      },
    },
    {
      id: "mfm-strategy",
      journeyId: "mutual-funds-mastery",
      title: "Advanced Mutual Fund Concepts",
      description: "Deep dive into portfolio pooling and asset management strategies.",
      order: 3,
      lessons: [
        {
          id: "mfm-strat-1",
          moduleId: "mfm-strategy",
          title: "Asset Management & Passive Income",
          order: 1,
          estimatedMinutes: 10,
          content: [
            {
              type: "heading",
              content: "The Power of Professional Management"
            },
            {
              type: "text",
              content: "Mutual funds pool investments into diversified assets managed by professionals. This allows you to benefit from high-level financial research even with a small capital base."
            },
            {
              type: "video",
              youtubeId: "RUv0qqzrbK0",
              title: "Passive Income through Mutual Funds"
            },
            {
              type: "keyTakeaway",
              items: [
                "Fund managers adjust portfolios based on market trends.",
                "Diversification is built-in.",
                "Ideal for building long-term passive wealth."
              ]
            }
          ]
        }
      ],
      quiz: {
        id: "mfm-strategy-quiz",
        moduleId: "mfm-strategy",
        title: "Test Your Knowledge: MF Strategies",
        passingScore: 60,
        questions: [
          {
            id: "q1",
            question: "What is a major benefit of pooling money in a mutual fund?",
            options: [
              "Guaranteed 50% returns",
              "Direct voting rights in companies",
              "Professional asset management and diversification",
              "Exemption from all taxes"
            ],
            correctIndex: 2,
            explanation: "Mutual funds allow individual investors to access professional management and broad diversification."
          }
        ]
      }
    }
  ],
};

// ====================================================================
//  JOURNEY 3: Financial Literacy Foundations
// ====================================================================

const financialLiteracy: LearningJourney = {
  id: "financial-literacy",
  title: "Financial Literacy Foundations",
  description:
    "Master personal finance fundamentals — budgeting, saving, and understanding financial statements.",
  difficulty: "beginner",
  category: "financial-literacy",
  estimatedMinutes: 45,
  coverColor: "#F59E0B",
  icon: "book",
  modules: [
    {
      id: "fl-budgeting",
      journeyId: "financial-literacy",
      title: "Budgeting & Saving",
      description: "Create a budget that works and build your emergency fund.",
      order: 1,
      lessons: [
        {
          id: "fl-budget-1",
          moduleId: "fl-budgeting",
          title: "The 50/30/20 Rule",
          order: 1,
          estimatedMinutes: 7,
          content: [
            {
              type: "heading",
              content: "A Simple Framework for Your Money",
            },
            {
              type: "text",
              content:
                "The 50/30/20 rule is one of the simplest budgeting frameworks. It divides your after-tax income into three categories: 50% for needs (rent, utilities, groceries), 30% for wants (dining out, entertainment), and 20% for savings and investments.",
            },
            {
              type: "text",
              content:
                "In a Pakistani context, this might look like: if your monthly take-home salary is PKR 100,000, you should aim to spend no more than PKR 50,000 on essentials, PKR 30,000 on lifestyle, and save/invest at least PKR 20,000.",
            },
            {
              type: "callout",
              variant: "tip",
              content:
                "If you can push your savings rate to 30% or more, you'll reach your financial goals much faster. The 50/30/20 rule is a starting point — not a ceiling.",
            },
            {
              type: "keyTakeaway",
              items: [
                "50% for needs (rent, food, utilities, transport).",
                "30% for wants (entertainment, dining, subscriptions).",
                "20% for savings, investments, and debt repayment.",
                "Adjust based on your income — higher earners should save more.",
              ],
            },
          ],
        },
        {
          id: "fl-budget-2",
          moduleId: "fl-budgeting",
          title: "Building an Emergency Fund",
          order: 2,
          estimatedMinutes: 6,
          content: [
            {
              type: "heading",
              content: "Your Financial Safety Net",
            },
            {
              type: "text",
              content:
                "An emergency fund is 3-6 months' worth of living expenses kept in a highly liquid, low-risk account. It protects you from unexpected events like job loss, medical emergencies, or car repairs without having to sell your investments or go into debt.",
            },
            {
              type: "list",
              ordered: true,
              items: [
                "Calculate your monthly essential expenses (rent, food, utilities, transport, loan payments).",
                "Multiply by 3 for a starter fund, 6 for a full safety net.",
                "Open a separate savings account or money market fund.",
                "Set up automatic monthly transfers until the target is reached.",
                "Only use it for genuine emergencies — not wants.",
              ],
            },
            {
              type: "callout",
              variant: "info",
              content:
                "In Pakistan, money market mutual funds are an excellent place for your emergency fund. They offer better returns than a regular savings account while still allowing same-day or next-day redemption.",
            },
            {
              type: "keyTakeaway",
              items: [
                "Aim for 3-6 months of essential expenses.",
                "Keep it liquid — savings account or money market fund.",
                "Automate contributions until you reach your target.",
                "Don't invest in stocks until your emergency fund is set.",
              ],
            },
          ],
        },
      ],
      quiz: {
        id: "fl-budgeting-quiz",
        moduleId: "fl-budgeting",
        title: "Test Your Knowledge: Budgeting",
        passingScore: 60,
        questions: [
          {
            id: "q1",
            question:
              "In the 50/30/20 rule, what percentage should go to savings and investments?",
            options: ["50%", "30%", "20%", "10%"],
            correctIndex: 2,
            explanation:
              "The 50/30/20 rule allocates 20% of after-tax income to savings and investments.",
          },
          {
            id: "q2",
            question: "How many months of expenses should an emergency fund cover?",
            options: [
              "1 month",
              "3-6 months",
              "12 months",
              "24 months",
            ],
            correctIndex: 1,
            explanation:
              "Financial advisors recommend 3-6 months of essential living expenses as an emergency fund.",
          },
          {
            id: "q3",
            question:
              "Where is the best place to keep your emergency fund in Pakistan?",
            options: [
              "Under your mattress",
              "In stocks on PSX",
              "In a money market mutual fund or savings account",
              "In cryptocurrency",
            ],
            correctIndex: 2,
            explanation:
              "Emergency funds should be in liquid, low-risk instruments. Money market funds and savings accounts fit this perfectly.",
          },
        ],
      },
    },
    {
      id: "fl-reading",
      journeyId: "financial-literacy",
      title: "Reading Financial Statements",
      description:
        "Learn to read a balance sheet, income statement, and cash flow statement.",
      order: 2,
      lessons: [
        {
          id: "fl-read-1",
          moduleId: "fl-reading",
          title: "The Three Core Financial Statements",
          order: 1,
          estimatedMinutes: 12,
          content: [
            {
              type: "heading",
              content: "The Language of Business",
            },
            {
              type: "text",
              content:
                "Every listed company on PSX is required to publish quarterly and annual financial statements. These are your window into the company's health. There are three core statements you need to understand:",
            },
            {
              type: "list",
              ordered: true,
              items: [
                "Income Statement (Profit & Loss) — shows revenue, expenses, and profit over a period. Think of it as a 'movie' of performance.",
                "Balance Sheet — shows what the company owns (assets), owes (liabilities), and what's left for shareholders (equity) at a point in time. Think of it as a 'photograph'.",
                "Cash Flow Statement — shows actual cash moving in and out. A company can show profits on the income statement but be cash-poor.",
              ],
            },
            {
              type: "callout",
              variant: "info",
              content:
                "You can find financial statements for all PSX-listed companies on the PSX website or on the companies' investor relations pages. Finasaan's AI chatbot can also help you analyze these statements.",
            },
            {
              type: "video",
              youtubeId: "6G_dQbx-Wg0",
              title: "He followed 22 things - I gave him 5!",
            },
            {
              type: "keyTakeaway",
              items: [
                "Income Statement = how much the company earned and spent.",
                "Balance Sheet = what the company owns vs. what it owes.",
                "Cash Flow Statement = actual cash movements (most important!).",
                "Always look at all three together for a complete picture.",
              ],
            },
          ],
        },
      ],
      quiz: {
        id: "fl-reading-quiz",
        moduleId: "fl-reading",
        title: "Test Your Knowledge: Financial Statements",
        passingScore: 60,
        questions: [
          {
            id: "q1",
            question:
              "Which financial statement shows a company's revenue and expenses?",
            options: [
              "Balance Sheet",
              "Income Statement",
              "Cash Flow Statement",
              "Tax Return",
            ],
            correctIndex: 1,
            explanation:
              "The Income Statement (also called Profit & Loss statement) shows revenue, expenses, and resulting profit or loss.",
          },
          {
            id: "q2",
            question: "Why is the Cash Flow Statement important?",
            options: [
              "It shows the company's stock price",
              "It reveals actual cash movements, even when profits look good on paper",
              "It lists all company employees",
              "It shows future projected earnings",
            ],
            correctIndex: 1,
            explanation:
              "A company can show accounting profits but have negative cash flow. The cash flow statement reveals the real liquidity picture.",
          },
          {
            id: "q3",
            question:
              "Which statement is a 'snapshot' of assets and liabilities at a single point in time?",
            options: [
              "Income Statement",
              "Cash Flow Statement",
              "Balance Sheet",
              "Dividend Report",
            ],
            correctIndex: 2,
            explanation:
              "The Balance Sheet shows assets, liabilities, and equity at a specific date — like a photograph of the company's financial position.",
          },
        ],
      },
    },
  ],
};

// ====================================================================
//  JOURNEY 4: Pakistan Taxation mastery
// ====================================================================

const pakistanTaxation: LearningJourney = {
  id: "pakistan-taxation",
  title: "Taxation in Pakistan",
  description: "Navigate FBR, understand Filer vs. Non-Filer status, and optimize your tax liability.",
  difficulty: "beginner",
  category: "taxation",
  estimatedMinutes: 45,
  coverColor: "#059669",
  icon: "file-text",
  modules: [
    {
      id: "tax-filer",
      journeyId: "pakistan-taxation",
      title: "Filer vs. Non-Filer",
      description: "The single most important concept in Pakistani taxation.",
      order: 1,
      lessons: [
        {
          id: "tax-filer-1",
          moduleId: "tax-filer",
          title: "The Core Concept",
          order: 1,
          estimatedMinutes: 10,
          content: [
            {
              type: "heading",
              content: "Understanding Your Status"
            },
            {
              type: "text",
              content: "In Pakistan, the distinction between a Filer (on the Active Taxpayers List - ATL) and a Non-Filer is massive. Being a Filer reduces your tax rates significantly across banking, investing, and property transactions."
            },
            {
              type: "video",
              youtubeId: "WvXmI90YI3g",
              title: "Filer vs Non-Filer Explained"
            },
            {
              type: "callout",
              variant: "info",
              content: "Being a filer = Lower taxes on dividends, bank withdrawals, and vehicle purchases."
            },
            {
              type: "keyTakeaway",
              items: [
                "Filers are on the FBR Active Taxpayers List (ATL).",
                "Non-filers pay up to 2x more withholding tax.",
                "Filing your returns is mandatory if you earn above the threshold."
              ]
            }
          ]
        }
      ],
      quiz: {
        id: "tax-filer-quiz",
        moduleId: "tax-filer",
        title: "Test Your Knowledge: Filer Status",
        passingScore: 60,
        questions: [
          {
            id: "q1",
            question: "What is the main benefit of being a 'Filer' in Pakistan?",
            options: [
              "You don't have to pay any tax",
              "You get free health insurance",
              "You pay significantly lower withholding tax rates",
              "You get a free passport"
            ],
            correctIndex: 2,
            explanation: "Filers pay reduced taxes on banking, property, and dividend income compared to non-filers."
          }
        ]
      }
    },
    {
      id: "tax-policy",
      journeyId: "pakistan-taxation",
      title: "Tax Policy & Reforms",
      description: "Understanding how FBR reforms affect the economy.",
      order: 2,
      lessons: [
        {
          id: "tax-policy-1",
          moduleId: "tax-policy",
          title: "Policy Level Understanding",
          order: 1,
          estimatedMinutes: 15,
          content: [
            {
              type: "heading",
              content: "Why Taxation Matters for the Economy"
            },
            {
              type: "text",
              content: "Understanding the government's tax reforms helps you plan your financial future. Credible sources like BBC Urdu provide deep dives into how these policies change over time."
            },
            {
              type: "video",
              youtubeId: "Qp0B0-YUnpI",
              title: "Explaining Pakistan's Tax Dilemma"
            },
            {
              type: "keyTakeaway",
              items: [
                "Tax reforms impact inflation and disposable income.",
                "The government uses tax policy to encourage formalization.",
                "Higher tax collection leads to better infrastructure (ideally)."
              ]
            }
          ]
        }
      ],
      quiz: {
        id: "tax-policy-quiz",
        moduleId: "tax-policy",
        title: "Test Your Knowledge: Tax Policy",
        passingScore: 60,
        questions: [
          {
            id: "q1",
            question: "Which body is responsible for tax collection in Pakistan?",
            options: ["SBP", "FBR", "SECP", "FIA"],
            correctIndex: 1,
            explanation: "The Federal Board of Revenue (FBR) is the central agency for tax administration in Pakistan."
          }
        ]
      }
    }
  ]
};

// ====================================================================
//  Exports
// ====================================================================

export const JOURNEYS: LearningJourney[] = [
  stockMarketBasics,
  mutualFundsMastery,
  financialLiteracy,
  pakistanTaxation,
];

export function getJourneyById(id: string): LearningJourney | undefined {
  return JOURNEYS.find((j) => j.id === id);
}

export function getModuleById(
  journeyId: string,
  moduleId: string,
) {
  const journey = getJourneyById(journeyId);
  if (!journey) return { journey: undefined, module: undefined };
  const module = journey.modules.find((m) => m.id === moduleId);
  return { journey, module };
}

export function getLessonById(
  journeyId: string,
  moduleId: string,
  lessonId: string,
) {
  const { journey, module } = getModuleById(journeyId, moduleId);
  if (!journey || !module) return { journey: undefined, module: undefined, lesson: undefined };
  const lesson = module.lessons.find((l) => l.id === lessonId);
  return { journey, module, lesson };
}

export const JOURNEY_STATS = {
  totalJourneys: JOURNEYS.length,
  totalModules: JOURNEYS.reduce((sum, j) => sum + j.modules.length, 0),
  totalLessons: JOURNEYS.reduce(
    (sum, j) =>
      sum + j.modules.reduce((ms, m) => ms + m.lessons.length, 0),
    0,
  ),
  totalQuizzes: JOURNEYS.reduce((sum, j) => sum + j.modules.length, 0),
  totalMinutes: JOURNEYS.reduce((sum, j) => sum + j.estimatedMinutes, 0),
};
