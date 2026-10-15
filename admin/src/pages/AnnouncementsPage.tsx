import { CrudPage } from '../components/CrudPage';
import { formatDateTime } from '../lib/dates';

export function AnnouncementsPage() {
  return (
    <CrudPage
      title="Announcements"
      table="announcements"
      orderBy={['sort_order', 'created_at']}
      defaults={{ is_active: true, sort_order: 0 }}
      fields={[
        { key: 'image_url', pathKey: 'image_path', label: 'Banner image (optional)', type: 'image', folder: 'banners' },
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'body', label: 'Text', type: 'textarea' },
        { key: 'link_url', label: 'Link', type: 'url', placeholder: 'https://…' },
        { key: 'starts_at', label: 'Show from (empty = now)', type: 'datetime' },
        { key: 'ends_at', label: 'Show until (empty = forever)', type: 'datetime' },
        { key: 'sort_order', label: 'Sort order (lower shows first)', type: 'number' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
      renderSummary={(row) => (
        <div>
          <div className="font-medium">
            {row.title as string}
            {!row.is_active && <span className="ml-2 text-xs text-slate-500">(off)</span>}
          </div>
          <div className="text-xs text-slate-500">
            {row.starts_at || row.ends_at
              ? `${formatDateTime(row.starts_at as string)} → ${formatDateTime(row.ends_at as string)}`
              : 'Always shown'}
          </div>
        </div>
      )}
    />
  );
}
