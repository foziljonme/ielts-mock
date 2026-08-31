import { ContentBlock, SectionQuestion } from '@/types'
import {Fragment} from 'react'

export default function FlowChart({
  block,
  questionsById,
  answersById,
  onAnswerChange,
}: {
  block: Extract<ContentBlock, { kind: 'flow_chart' }>
  questionsById: Record<string, SectionQuestion>
  answersById: Record<string, string>
  onAnswerChange: (qid: string, val: string) => void
}) {
  return (
    <div className="flex flex-col items-center gap-0">
      {block.nodes.map((node, i) => (
        <Fragment key={i}>
          <div
            className="
              w-full max-w-xl
              rounded-lg
              border border-gray-300
              bg-white
              px-5 py-4
              text-sm text-gray-800
              shadow-sm
            "
          >
            {node.map((inlineNode, ni) =>
              renderInlineNode(
                inlineNode,
                ni,
                'FLOW_CHART_COMPLETION',
                questionsById,
                answersById,
                onAnswerChange,
              ),
            )}
          </div>

          {i < block.nodes.length - 1 && (
            <div className="flex flex-col items-center">
              <div className="h-5 w-px bg-gray-400" />
              <div className="text-gray-400 text-sm leading-none">▼</div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
