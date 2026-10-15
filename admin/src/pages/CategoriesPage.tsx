import { CrudPage } from '../components/CrudPage';

export function CategoriesPage() {
  return (
    <CrudPage
      title="Event types"
      table="categories"
      orderBy={['sort_order', 'name']}
      defaults={{ sort_order: 0, color: '#6366f1' }}
      deleteWarning="Delete this event type? Its events stay, but lose their type."
      fields={[
        { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g. Technical' },
        { key: 'icon', label: 'Icon name (used by the app)', type: 'text', placeholder: 'e.g. code' },
        { key: 'color', label: 'Colour', type: 'color' },
        { key: 'sort_order', label: 'Sort order (lower shows first)', type: 'number' },
      ]}
      renderSummary={(row) => (
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full" style={{ background: (row.color as string) ?? '#cbd5e1' }} />
          <span className="font-medium">{row.name as string}</span>
          {row.icon ? <span className="text-xs text-slate-500">icon: {row.icon as string}</span> : null}
        </div>
      )}
    />
  );
}
