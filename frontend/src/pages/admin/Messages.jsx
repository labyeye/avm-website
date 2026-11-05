import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { PageShell } from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { useToast } from '../../components/admin/Toast';
import { getMessages, deleteMessage } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

export default function Messages({ embedded = false }) {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [target, setTarget] = useState(null);

  useEffect(() => {
    getMessages().then(setRows).catch((e) => toast.error(errorMessage(e, 'Failed to load messages')));
  }, [toast]);

  const remove = async () => {
    try {
      await deleteMessage(target.id);
      setRows((r) => r.filter((x) => x.id !== target.id));
      toast.success('Message deleted');
      setTarget(null);
    } catch (e) { toast.error(errorMessage(e, 'Delete failed')); }
  };

  return (
    <PageShell embedded={embedded} title="Contact Messages">
      <DataTable
        rows={rows}
        searchKeys={['name', 'email', 'subject']}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'subject', label: 'Subject' },
          { key: 'message', label: 'Message', render: (r) => <div className="max-w-xs whitespace-pre-line">{r.message}</div> },
          { key: 'submitted_at', label: 'Received' },
        ]}
        actions={(r) => <button className="text-red-600" onClick={() => setTarget(r)} aria-label="Delete"><Trash2 size={16} /></button>}
      />
      <Modal open={!!target} title="Delete message?" onClose={() => setTarget(null)}
        footer={<><button className="btn-ghost" onClick={() => setTarget(null)}>Cancel</button><button className="btn-danger" onClick={remove}>Delete</button></>}>
        Delete the message from <b>{target?.name}</b>?
      </Modal>
    </PageShell>
  );
}
