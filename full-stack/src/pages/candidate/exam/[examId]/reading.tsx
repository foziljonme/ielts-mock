export default function Test() {
  return <h1>Huyuu</h1>
}

// import React, { useState, useRef } from 'react'
// import {
//   BookOpen,
//   CircleCheck,
//   ChevronLeft,
//   ChevronRight,
//   Highlighter,
//   StickyNote,
//   Maximize2,
//   Minimize2,
// } from 'lucide-react'
// import { TestTimer } from '../../components/TestTimer'
// import { Button } from '@/components/button'
// import { TextHighlighter } from '../../components/TextHighlighter'
// import { RadioGroup, RadioGroupItem } from '@/components/radio-group'
// import { Label } from '@/components/label'
// import { Input } from '@/components/input'

// interface ReadingSectionProps {
//   onComplete: (answers: Record<string, string>) => void
//   onTimeUp: () => void
// }

// // ─── READING SECTION (3 passages, ~13 questions each) ─────────────────────────

// const passage1 = `The History of the Bicycle

// The bicycle, as we know it today, is a relatively modern invention. The first verifiable claim for a practical bicycle belongs to Baron Karl von Drais, a German civil servant, who invented his Laufmaschine (running machine) in 1817. This early bicycle was propelled by pushing feet against the ground, and it featured a steerable front wheel. Von Drais' invention was the foundation for what would become one of the most important forms of transportation in history.

// The evolution of the bicycle throughout the 19th century was marked by several significant innovations. In the 1860s, French inventors Pierre Michaux and Pierre Lallement added pedals to the front wheel, creating the velocipede, commonly known as the "bone shaker" due to its uncomfortable wooden wheels and iron frame. This design was revolutionary at the time, as it allowed riders to propel themselves without touching the ground.

// The 1870s saw the introduction of the penny-farthing, or high-wheel bicycle, which featured a large front wheel and a much smaller rear wheel. The large wheel allowed for greater speeds, as each rotation of the pedals moved the bicycle further. However, this design was dangerous, with riders perched high above the ground and at risk of "taking a header" over the front wheel during sudden stops.

// The safety bicycle, introduced in the 1880s, revolutionized cycling by featuring two wheels of equal size and a chain-driven rear wheel. This design, along with the invention of pneumatic tires by John Boyd Dunlop in 1888, made cycling comfortable and accessible to the masses. The safety bicycle's design remains the basic template for bicycles manufactured today.

// The bicycle's impact on society has been profound. It played a crucial role in the women's rights movement of the late 19th century, providing women with unprecedented mobility and independence. Susan B. Anthony declared in 1896 that the bicycle had "done more to emancipate women than anything else in the world." The bicycle also spurred the development of better roads and was a precursor to the automobile industry, with many early car manufacturers, including Henry Ford, beginning their careers in the bicycle business.`

// const passage2 = `The Science of Sleep

// Sleep is a fundamental biological necessity, yet its precise function remains one of science's most tantalising mysteries. For decades, researchers assumed that sleep was simply the brain's way of switching off and conserving energy. Contemporary neuroscience, however, paints a far more dynamic picture: sleep is an active, highly organised process essential for cognitive function, emotional regulation, and physical restoration.

// The human sleep cycle consists of two main phases: Rapid Eye Movement (REM) sleep and Non-REM (NREM) sleep, which is further divided into three stages. A typical night involves four to six complete cycles, each lasting approximately 90 minutes. During NREM sleep, particularly the deepest stage known as slow-wave sleep, the body repairs tissues, builds bone and muscle, and strengthens the immune system. REM sleep, which intensifies towards morning, is associated with vivid dreaming and plays a critical role in memory consolidation and emotional processing.

// Research published in the journal Nature in 2019 identified a molecular mechanism underlying the need to sleep. Scientists discovered that a protein called SIK3 accumulates phosphorylation — chemical modifications — during wakefulness. As these modifications build up, the pressure to sleep increases. This finding helps explain why extended wakefulness leads to an overwhelming urge to rest, and why recovery sleep is so effective at restoring alertness.

// Chronic sleep deprivation carries serious consequences. Studies have linked insufficient sleep to an increased risk of cardiovascular disease, type 2 diabetes, obesity, and depression. A landmark study conducted at the University of California found that participants restricted to six hours of sleep per night for two weeks performed as poorly on cognitive tests as those kept awake for 48 hours straight — yet, crucially, they reported feeling only slightly sleepy. This "sleep debt blindness" means that many people chronically underestimate their own impairment.

// Modern society's relationship with sleep has deteriorated significantly. Artificial lighting, smartphones, and demanding work schedules push the average sleep duration ever lower. The World Health Organisation has described insufficient sleep as a global public health epidemic. Sleep specialists consistently recommend seven to nine hours per night for adults, yet surveys in developed countries suggest that a third of the adult population regularly falls short of this target, with potentially far-reaching implications for public health and economic productivity.`

// const passage3 = `Rewilding: Restoring Nature's Balance

// Rewilding — the large-scale restoration of ecosystems to their natural, self-sustaining state — has emerged as one of the most ambitious and controversial approaches to conservation in recent decades. Unlike traditional conservation, which often focuses on protecting specific species, rewilding seeks to restore ecological processes and allow nature to manage itself, with minimal ongoing human intervention.

// The concept gained global attention following the reintroduction of wolves into Yellowstone National Park in the United States in 1995. The return of a keystone predator triggered a cascade of ecological changes known as a "trophic cascade." Wolf predation reduced the population of elk, which had been overgrazing riverbanks. Vegetation recovered, rivers narrowed and stabilised as root systems strengthened banks, and populations of birds, beavers, and fish rebounded. This dramatic sequence demonstrated how a single species can reshape an entire landscape.

// Europe has become the epicentre of rewilding ambition. Rewilding Europe, a non-governmental organisation founded in 2011, works across ten areas spanning eight countries, aiming to restore a million hectares of land by 2030. Projects range from the return of European bison to Romania's Carpathian Mountains to allowing rivers in the Netherlands to flood their natural plains. In Scotland, discussions about reintroducing lynx and even wolves have divided rural communities, with farmers expressing concern about livestock predation and conservationists arguing that predators are essential for ecosystem health.

// Critics of rewilding raise several legitimate concerns. Some ecologists argue that the pristine "baseline" to which rewilders aspire is itself a historical construct — ecosystems have always been in flux, and the notion of a pre-human natural state is largely illusory. Others point to conflicts between rewilding ambitions and the needs of rural communities that depend on the land for their livelihoods. The financial sustainability of rewilding projects beyond initial funding periods is another persistent question.

// Proponents counter that rewilding is not about recreating a mythical past but about enabling ecosystems to become resilient and self-regulating once more. In an era of accelerating biodiversity loss and climate change, they argue, the risks of inaction far outweigh the complexities of intervention. Whether rewilding can reconcile ecological ambition with social reality remains one of conservation's defining challenges for the 21st century.`

// export const mockReadingSection = {
//   id: 'reading-1',
//   name: 'Academic Reading',
//   duration: 60,
//   passage: passage1,
//   questions: [
//     // Passage 1 questions (Q1–13)
//     {
//       id: 'r1',
//       type: 'multiple-choice',
//       question:
//         'Passage 1 – Questions 1–13\n\nWho invented the first practical bicycle?',
//       options: [
//         'Pierre Michaux',
//         'Baron Karl von Drais',
//         'Pierre Lallement',
//         'John Boyd Dunlop',
//       ],
//       correctAnswer: 'Baron Karl von Drais',
//     },
//     {
//       id: 'r2',
//       type: 'multiple-choice',
//       question: 'What was the velocipede commonly known as?',
//       options: [
//         'The running machine',
//         'The bone shaker',
//         'The penny-farthing',
//         'The safety bicycle',
//       ],
//       correctAnswer: 'The bone shaker',
//     },
//     {
//       id: 'r3',
//       type: 'true-false-not-given',
//       question: 'The penny-farthing was safer than the safety bicycle.',
//       correctAnswer: 'FALSE',
//     },
//     {
//       id: 'r4',
//       type: 'true-false-not-given',
//       question: 'John Boyd Dunlop invented pneumatic tires in 1888.',
//       correctAnswer: 'TRUE',
//     },
//     {
//       id: 'r5',
//       type: 'fill-blank',
//       question:
//         'Susan B. Anthony stated that the bicycle had done more to emancipate _____ than anything else.',
//       correctAnswer: 'women',
//     },
//     {
//       id: 'r6',
//       type: 'multiple-choice',
//       question:
//         'Which innovation made cycling comfortable and accessible to the masses?',
//       options: [
//         'The velocipede',
//         'Pneumatic tires',
//         'The penny-farthing',
//         'The Laufmaschine',
//       ],
//       correctAnswer: 'Pneumatic tires',
//     },
//     {
//       id: 'r7',
//       type: 'true-false-not-given',
//       question: 'Henry Ford began his career in the bicycle business.',
//       correctAnswer: 'NOT GIVEN',
//     },
//     {
//       id: 'r8',
//       type: 'fill-blank',
//       question: 'The safety bicycle featured two wheels of _____ size.',
//       correctAnswer: 'equal',
//     },
//     {
//       id: 'r9',
//       type: 'multiple-choice',
//       question: 'What was the main danger associated with the penny-farthing?',
//       options: [
//         'Uncomfortable ride',
//         'Poor steering',
//         'Risk of falling forward',
//         'Slow speed',
//       ],
//       correctAnswer: 'Risk of falling forward',
//     },
//     {
//       id: 'r10',
//       type: 'true-false-not-given',
//       question: 'Von Drais invented his bicycle in France.',
//       correctAnswer: 'FALSE',
//     },
//     {
//       id: 'r11',
//       type: 'fill-blank',
//       question: 'The velocipede was created in the _____.',
//       correctAnswer: '1860s',
//     },
//     {
//       id: 'r12',
//       type: 'true-false-not-given',
//       question: 'The safety bicycle design is still used in modern bicycles.',
//       correctAnswer: 'TRUE',
//     },
//     {
//       id: 'r13',
//       type: 'multiple-choice',
//       question: 'What did the development of bicycles help to create?',
//       options: [
//         'Railways',
//         'Better roads',
//         'Maritime trade routes',
//         'Airplanes',
//       ],
//       correctAnswer: 'Better roads',
//     },

//     // Passage 2 questions (Q14–26)
//     {
//       id: 'r14',
//       type: 'multiple-choice',
//       question:
//         'Passage 2 – Questions 14–26\n\nAccording to contemporary neuroscience, sleep is best described as:',
//       options: [
//         'A passive energy-saving state',
//         'An active, organised biological process',
//         'A simple shutdown of the brain',
//         'A period of reduced brain activity',
//       ],
//       correctAnswer: 'An active, organised biological process',
//     },
//     {
//       id: 'r15',
//       type: 'fill-blank',
//       question: 'A typical sleep cycle lasts approximately _____ minutes.',
//       correctAnswer: '90',
//     },
//     {
//       id: 'r16',
//       type: 'true-false-not-given',
//       question: 'Slow-wave sleep occurs during the REM phase.',
//       correctAnswer: 'FALSE',
//     },
//     {
//       id: 'r17',
//       type: 'multiple-choice',
//       question: 'What protein was identified in the 2019 Nature study?',
//       options: ['SIK1', 'SIK3', 'REM-1', 'NREM-2'],
//       correctAnswer: 'SIK3',
//     },
//     {
//       id: 'r18',
//       type: 'true-false-not-given',
//       question:
//         'The University of California study found that six hours of sleep per night led to significant impairment.',
//       correctAnswer: 'TRUE',
//     },
//     {
//       id: 'r19',
//       type: 'fill-blank',
//       question:
//         'Participants restricted to six hours of sleep performed as poorly as those kept awake for _____ hours.',
//       correctAnswer: '48',
//     },
//     {
//       id: 'r20',
//       type: 'multiple-choice',
//       question: 'What does "sleep debt blindness" refer to?',
//       options: [
//         'Inability to see clearly after waking',
//         "Underestimating one's own sleep impairment",
//         'A medical condition caused by sleep deprivation',
//         'Forgetting dreams after waking',
//       ],
//       correctAnswer: "Underestimating one's own sleep impairment",
//     },
//     {
//       id: 'r21',
//       type: 'true-false-not-given',
//       question:
//         'The World Health Organisation recommends eight hours of sleep for all adults.',
//       correctAnswer: 'NOT GIVEN',
//     },
//     {
//       id: 'r22',
//       type: 'fill-blank',
//       question:
//         'Sleep specialists recommend _____ to _____ hours per night for adults.',
//       correctAnswer: 'seven to nine',
//     },
//     {
//       id: 'r23',
//       type: 'multiple-choice',
//       question:
//         'Which of the following is NOT listed as a consequence of chronic sleep deprivation?',
//       options: [
//         'Cardiovascular disease',
//         'Type 2 diabetes',
//         'Hearing loss',
//         'Depression',
//       ],
//       correctAnswer: 'Hearing loss',
//     },
//     {
//       id: 'r24',
//       type: 'true-false-not-given',
//       question:
//         'Artificial lighting is a factor that has reduced average sleep duration.',
//       correctAnswer: 'TRUE',
//     },
//     {
//       id: 'r25',
//       type: 'fill-blank',
//       question:
//         'REM sleep is associated with memory _____ and emotional processing.',
//       correctAnswer: 'consolidation',
//     },
//     {
//       id: 'r26',
//       type: 'multiple-choice',
//       question:
//         'What does the passage suggest about the proportion of adults in developed countries not getting enough sleep?',
//       options: ['One quarter', 'One third', 'One half', 'Two thirds'],
//       correctAnswer: 'One third',
//     },

//     // Passage 3 questions (Q27–40)
//     {
//       id: 'r27',
//       type: 'multiple-choice',
//       question:
//         'Passage 3 – Questions 27–40\n\nHow does rewilding differ from traditional conservation?',
//       options: [
//         'It focuses on individual species',
//         'It uses more intensive human management',
//         'It seeks to restore ecological processes with minimal intervention',
//         'It relies exclusively on government funding',
//       ],
//       correctAnswer:
//         'It seeks to restore ecological processes with minimal intervention',
//     },
//     {
//       id: 'r28',
//       type: 'fill-blank',
//       question:
//         'Wolves were reintroduced to Yellowstone National Park in _____.',
//       correctAnswer: '1995',
//     },
//     {
//       id: 'r29',
//       type: 'true-false-not-given',
//       question:
//         'The return of wolves to Yellowstone caused elk populations to increase.',
//       correctAnswer: 'FALSE',
//     },
//     {
//       id: 'r30',
//       type: 'multiple-choice',
//       question: 'What is a "trophic cascade"?',
//       options: [
//         'A type of waterfall in national parks',
//         'A chain of ecological changes caused by a keystone species',
//         'A method of tracking animal migration',
//         'A rewilding funding mechanism',
//       ],
//       correctAnswer:
//         'A chain of ecological changes caused by a keystone species',
//     },
//     {
//       id: 'r31',
//       type: 'true-false-not-given',
//       question: 'Rewilding Europe was established before 2010.',
//       correctAnswer: 'FALSE',
//     },
//     {
//       id: 'r32',
//       type: 'fill-blank',
//       question:
//         'Rewilding Europe aims to restore _____ hectares of land by 2030.',
//       correctAnswer: 'a million',
//     },
//     {
//       id: 'r33',
//       type: 'multiple-choice',
//       question: 'What is one concern raised by critics of rewilding?',
//       options: [
//         'It costs too little',
//         'The concept of a natural baseline is questionable',
//         'It has never succeeded anywhere',
//         'Governments fully support it',
//       ],
//       correctAnswer: 'The concept of a natural baseline is questionable',
//     },
//     {
//       id: 'r34',
//       type: 'true-false-not-given',
//       question: 'Farmers in Scotland support the reintroduction of wolves.',
//       correctAnswer: 'FALSE',
//     },
//     {
//       id: 'r35',
//       type: 'fill-blank',
//       question:
//         "In Romania's Carpathian Mountains, the species reintroduced was the European _____.",
//       correctAnswer: 'bison',
//     },
//     {
//       id: 'r36',
//       type: 'true-false-not-given',
//       question:
//         'The passage states that rewilding projects are always financially self-sustaining.',
//       correctAnswer: 'FALSE',
//     },
//     {
//       id: 'r37',
//       type: 'multiple-choice',
//       question: 'According to rewilding proponents, what is the main goal?',
//       options: [
//         'Recreating a pre-human landscape',
//         'Enabling ecosystems to become resilient and self-regulating',
//         'Eliminating all human activity from wild areas',
//         'Increasing tourism revenue',
//       ],
//       correctAnswer:
//         'Enabling ecosystems to become resilient and self-regulating',
//     },
//     {
//       id: 'r38',
//       type: 'true-false-not-given',
//       question:
//         'Biodiversity loss is mentioned as a reason rewilding proponents argue for action.',
//       correctAnswer: 'TRUE',
//     },
//     {
//       id: 'r39',
//       type: 'fill-blank',
//       question:
//         'In the Netherlands, rivers have been allowed to flood their natural _____.',
//       correctAnswer: 'plains',
//     },
//     {
//       id: 'r40',
//       type: 'multiple-choice',
//       question: 'The passage is primarily concerned with:',
//       options: [
//         'Criticising rewilding projects',
//         'Presenting a balanced view of rewilding',
//         'Promoting large-scale rewilding globally',
//         'Describing specific animal species',
//       ],
//       correctAnswer: 'Presenting a balanced view of rewilding',
//     },
//   ],
// }

// // Passage texts exported separately for the reading section component
// export const readingPassages = [
//   {
//     id: 'passage-1',
//     title: 'The History of the Bicycle',
//     text: passage1,
//     questionRange: [1, 13],
//     questionIds: [
//       'r1',
//       'r2',
//       'r3',
//       'r4',
//       'r5',
//       'r6',
//       'r7',
//       'r8',
//       'r9',
//       'r10',
//       'r11',
//       'r12',
//       'r13',
//     ],
//   },
//   {
//     id: 'passage-2',
//     title: 'The Science of Sleep',
//     text: passage2,
//     questionRange: [14, 26],
//     questionIds: [
//       'r14',
//       'r15',
//       'r16',
//       'r17',
//       'r18',
//       'r19',
//       'r20',
//       'r21',
//       'r22',
//       'r23',
//       'r24',
//       'r25',
//       'r26',
//     ],
//   },
//   {
//     id: 'passage-3',
//     title: "Rewilding: Restoring Nature's Balance",
//     text: passage3,
//     questionRange: [27, 40],
//     questionIds: [
//       'r27',
//       'r28',
//       'r29',
//       'r30',
//       'r31',
//       'r32',
//       'r33',
//       'r34',
//       'r35',
//       'r36',
//       'r37',
//       'r38',
//       'r39',
//       'r40',
//     ],
//   },
// ]

// type HighlightAnnotation = any

// export default function ReadingSection({
//   onComplete,
//   onTimeUp,
// }: ReadingSectionProps) {
//   const [answers, setAnswers] = useState<Record<string, string>>({})
//   const [currentPassageIndex, setCurrentPassageIndex] = useState(0)
//   const [highlights, setHighlights] = useState<HighlightAnnotation[]>([])
//   const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
//   const [passageExpanded, setPassageExpanded] = useState(false)
//   const questionPanelRef = useRef<HTMLDivElement>(null)

//   const currentPassage = readingPassages[currentPassageIndex]
//   const currentQuestions = mockReadingSection.questions.filter(q =>
//     currentPassage.questionIds.includes(q.id),
//   )

//   const answeredCount = Object.keys(answers).length
//   const totalQuestions = mockReadingSection.questions.length

//   const handleAnswerChange = (questionId: string, answer: string) => {
//     setAnswers(prev => ({ ...prev, [questionId]: answer }))
//   }

//   const handleHighlight = (h: HighlightAnnotation) => {
//     setHighlights(prev => [...prev, h])
//   }

//   const handleRemoveHighlight = (id: string) => {
//     setHighlights(prev => prev.filter(h => h.id !== id))
//   }

//   const handleSubmit = () => {
//     onComplete(answers)
//   }

//   const handleTimeUp = () => {
//     onTimeUp()
//     handleSubmit()
//   }

//   const scrollToQuestion = (qid: string) => {
//     const el = document.getElementById(`q-${qid}`)
//     if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
//     // Find which passage this question belongs to
//     const passageIdx = readingPassages.findIndex(p =>
//       p.questionIds.includes(qid),
//     )
//     if (passageIdx !== -1 && passageIdx !== currentPassageIndex) {
//       setCurrentPassageIndex(passageIdx)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* ── Header ── */}
//       <div className="bg-white border-b px-6 py-3 sticky top-0 z-20 shadow-sm">
//         <div className="max-w-full mx-auto flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2 text-green-700 font-semibold text-lg">
//               <BookOpen className="w-5 h-5" />
//               IELTS Academic Reading
//             </div>
//             <span className="hidden sm:inline text-gray-400">|</span>
//             <span className="hidden sm:inline text-sm text-gray-600">
//               {answeredCount} / {totalQuestions} answered
//             </span>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="hidden md:flex items-center gap-1 text-xs text-gray-500 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded">
//               <Highlighter className="w-3 h-3 text-yellow-500" />
//               Select text in passage to highlight
//             </div>
//             <TestTimer duration={60} onTimeUp={handleTimeUp} isActive={true} />
//             <Button size="sm" onClick={() => setShowSubmitConfirm(true)}>
//               Submit Test
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* ── Passage tabs ── */}
//       <div className="bg-white border-b px-6">
//         <div className="max-w-full mx-auto flex gap-0">
//           {readingPassages.map((p, i) => {
//             const passageAnswered = p.questionIds.filter(
//               qid => answers[qid],
//             ).length
//             return (
//               <button
//                 key={p.id}
//                 onClick={() => setCurrentPassageIndex(i)}
//                 className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
//                   i === currentPassageIndex
//                     ? 'border-green-600 text-green-700'
//                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Passage {i + 1}
//                 <span
//                   className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${passageAnswered === p.questionIds.length ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
//                 >
//                   {passageAnswered}/{p.questionIds.length}
//                 </span>
//               </button>
//             )
//           })}
//         </div>
//       </div>

//       {/* ── Split screen ── */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Left: passage */}
//         <div
//           className={`${passageExpanded ? 'w-2/3' : 'w-1/2'} transition-all duration-200 border-r bg-white overflow-y-auto`}
//           style={{ height: 'calc(100vh - 112px)' }}
//         >
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
//                   Passage {currentPassageIndex + 1}
//                 </p>
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   {currentPassage.title}
//                 </h2>
//               </div>
//               <button
//                 onClick={() => setPassageExpanded(e => !e)}
//                 className="text-gray-400 hover:text-gray-600 p-1"
//                 title={passageExpanded ? 'Restore split' : 'Expand passage'}
//               >
//                 {passageExpanded ? (
//                   <Minimize2 className="w-4 h-4" />
//                 ) : (
//                   <Maximize2 className="w-4 h-4" />
//                 )}
//               </button>
//             </div>
//             <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed text-[15px]">
//               <TextHighlighter
//                 text={currentPassage.text}
//                 highlights={highlights.filter(h =>
//                   h.id.startsWith(`p${currentPassageIndex}`),
//                 )}
//                 onHighlight={h =>
//                   handleHighlight({
//                     ...h,
//                     id: `p${currentPassageIndex}-${h.id}`,
//                   })
//                 }
//                 onRemoveHighlight={handleRemoveHighlight}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Right: questions */}
//         <div
//           ref={questionPanelRef}
//           className={`${passageExpanded ? 'w-1/3' : 'w-1/2'} transition-all duration-200 bg-gray-50 overflow-y-auto`}
//           style={{ height: 'calc(100vh - 112px)' }}
//         >
//           <div className="p-6 space-y-4">
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
//               Questions {currentPassage.questionRange[0]}–
//               {currentPassage.questionRange[1]} — refer to Passage{' '}
//               {currentPassageIndex + 1}
//             </div>

//             {currentQuestions.map((question, idx) => {
//               const globalIdx = currentPassage.questionRange[0] + idx - 1
//               const answered = !!answers[question.id]
//               // Strip passage header from question text
//               const lines = question.question.split('\n')
//               const questionText = lines[lines.length - 1]
//               const hasHeader = lines.length > 1

//               return (
//                 <div
//                   key={question.id}
//                   id={`q-${question.id}`}
//                   className={`bg-white rounded-xl border-2 p-4 transition-all ${answered ? 'border-green-200' : 'border-gray-100'}`}
//                 >
//                   {hasHeader && (
//                     <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 pb-2 border-b">
//                       {lines[0]}
//                     </div>
//                   )}
//                   <div className="flex items-start gap-3 mb-3">
//                     <span
//                       className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${answered ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'}`}
//                     >
//                       {globalIdx + 1}
//                     </span>
//                     <p className="text-sm text-gray-800 leading-relaxed">
//                       {questionText}
//                     </p>
//                   </div>

//                   {question.type === 'multiple-choice' && question.options && (
//                     <RadioGroup
//                       value={answers[question.id] || ''}
//                       onValueChange={val =>
//                         handleAnswerChange(question.id, val)
//                       }
//                       className="ml-10"
//                     >
//                       <div className="space-y-2">
//                         {question.options.map((opt, oi) => (
//                           <div key={oi} className="flex items-center space-x-2">
//                             <RadioGroupItem
//                               value={opt}
//                               id={`${question.id}-${oi}`}
//                             />
//                             <Label
//                               htmlFor={`${question.id}-${oi}`}
//                               className="text-sm cursor-pointer font-normal"
//                             >
//                               <span className="font-semibold text-gray-400 mr-1">
//                                 {String.fromCharCode(65 + oi)}.
//                               </span>
//                               {opt}
//                             </Label>
//                           </div>
//                         ))}
//                       </div>
//                     </RadioGroup>
//                   )}

//                   {question.type === 'true-false-not-given' && (
//                     <RadioGroup
//                       value={answers[question.id] || ''}
//                       onValueChange={val =>
//                         handleAnswerChange(question.id, val)
//                       }
//                       className="ml-10"
//                     >
//                       <div className="flex gap-3 flex-wrap">
//                         {['TRUE', 'FALSE', 'NOT GIVEN'].map(opt => (
//                           <div
//                             key={opt}
//                             className="flex items-center space-x-2"
//                           >
//                             <RadioGroupItem
//                               value={opt}
//                               id={`${question.id}-${opt}`}
//                             />
//                             <Label
//                               htmlFor={`${question.id}-${opt}`}
//                               className="text-sm cursor-pointer font-medium"
//                             >
//                               {opt}
//                             </Label>
//                           </div>
//                         ))}
//                       </div>
//                     </RadioGroup>
//                   )}

//                   {question.type === 'fill-blank' && (
//                     <div className="ml-10">
//                       <Input
//                         value={answers[question.id] || ''}
//                         onChange={e =>
//                           handleAnswerChange(question.id, e.target.value)
//                         }
//                         placeholder="Write your answer..."
//                         className="text-sm max-w-xs"
//                       />
//                     </div>
//                   )}
//                 </div>
//               )
//             })}

//             {/* Passage navigation */}
//             <div className="flex justify-between pt-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPassageIndex(i => i - 1)}
//                 disabled={currentPassageIndex === 0}
//               >
//                 <ChevronLeft className="w-4 h-4 mr-1" />
//                 Passage {currentPassageIndex}
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPassageIndex(i => i + 1)}
//                 disabled={currentPassageIndex === readingPassages.length - 1}
//               >
//                 Passage {currentPassageIndex + 2}
//                 <ChevronRight className="w-4 h-4 ml-1" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Question navigator footer ── */}
//       <div className="bg-white border-t px-6 py-3">
//         <div className="max-w-full mx-auto flex items-center gap-4 overflow-x-auto">
//           <span className="text-xs text-gray-500 whitespace-nowrap">
//             Jump to:
//           </span>
//           <div className="flex gap-1 flex-wrap">
//             {mockReadingSection.questions.map((q, i) => {
//               const done = !!answers[q.id]
//               const passageIdx = readingPassages.findIndex(p =>
//                 p.questionIds.includes(q.id),
//               )
//               const isCurrent = passageIdx === currentPassageIndex
//               return (
//                 <button
//                   key={q.id}
//                   onClick={() => scrollToQuestion(q.id)}
//                   className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
//                     done
//                       ? 'bg-green-500 text-white'
//                       : isCurrent
//                         ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                         : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
//                   }`}
//                   title={`Question ${i + 1}`}
//                 >
//                   {i + 1}
//                 </button>
//               )
//             })}
//           </div>
//           <div className="ml-auto flex items-center gap-3 text-xs whitespace-nowrap">
//             <span className="flex items-center gap-1">
//               <span className="w-3 h-3 rounded bg-green-500 inline-block" />{' '}
//               Answered
//             </span>
//             <span className="flex items-center gap-1">
//               <span className="w-3 h-3 rounded bg-green-100 inline-block border border-green-300" />{' '}
//               Current passage
//             </span>
//             <span className="flex items-center gap-1">
//               <span className="w-3 h-3 rounded bg-gray-100 inline-block border" />{' '}
//               Other passage
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Submit confirmation */}
//       {showSubmitConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
//             <h3 className="text-lg font-semibold mb-3">Submit Reading Test?</h3>
//             <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
//               <p className="text-sm text-amber-800">
//                 You have answered <strong>{answeredCount}</strong> out of{' '}
//                 <strong>{totalQuestions}</strong> questions.
//                 {answeredCount < totalQuestions && (
//                   <span className="block mt-1 font-medium">
//                     {totalQuestions - answeredCount} question(s) unanswered.
//                   </span>
//                 )}
//               </p>
//             </div>
//             <p className="text-sm text-gray-600 mb-5">
//               Once submitted, you cannot change your answers.
//             </p>
//             <div className="flex gap-3 justify-end">
//               <Button
//                 variant="outline"
//                 onClick={() => setShowSubmitConfirm(false)}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleSubmit}>Submit Test</Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
