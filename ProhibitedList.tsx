// DRAFT list. Have a lawyer review it before real customers use the site.
export const PROHIBITED = [
  'Weapons, guns, ammunition and knives made for harm',
  'Explosives, fireworks, gas cylinders and flammable liquids',
  'Illegal drugs and controlled substances',
  'Stolen goods',
  'Counterfeit money, documents or goods',
  'Hazardous chemicals and poisons',
  'Anything else that is illegal in Nigeria',
]

export default function ProhibitedList() {
  return (
    <details>
      <summary>See the items you must not send</summary>
      <ul style={{ margin: '.5rem 0', paddingLeft: '1.2rem' }}>
        {PROHIBITED.map(p => <li key={p}>{p}</li>)}
      </ul>
    </details>
  )
}
