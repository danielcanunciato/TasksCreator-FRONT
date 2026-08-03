
import "./index.css"
import { Check, X } from "lucide-react"

export default function TasksMemo({ content, onCompletion }) {
  return (
    <tr>
      <td>
        <h3 className="task-id">TkID_#{content.id}</h3>
      </td>
      <td>
        <h3 className="task-title">{content.title}</h3>
      </td>
      <td>
        <p className="task-desc">{content.desc || content.description || ''}</p>
      </td>
      <td>
        <button className={`task-button ${content.completed ? 'completed' : ''}`} onClick={() => onCompletion(content.id)}>
          {content.completed ? <Check className="licon" /> : <X className="licon" />}
        </button>
      </td>
    </tr>
  );
}