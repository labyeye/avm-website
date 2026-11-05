import { useEffect, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { PageShell } from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { useToast } from '../../components/admin/Toast';
import { getAdmissions, deleteAdmission } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

const csvCell = (v) => {
  let s = String(v ?? '');
  // Neutralise spreadsheet formula injection
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export default function Admissions({ embedded = false }) {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getAdmissions().then(setRows).catch((e) => toast.error(errorMessage(e, 'Failed to load admissions')));
  }, [toast]);

  const exportCsv = () => {
    const head = ['#', 'Student Name', 'Parent Name', 'Email', 'Phone', 'DOB', 'Class', 'Submitted At'];
    const lines = rows.map((r, i) => [i + 1, r.student_name, r.parent_name, r.email, r.phone, r.dob, r.class_applied, r.submitted_at].map(csvCell).join(','));
    const blob = new Blob(['﻿' + [head.map(csvCell).join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'admissions.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await deleteAdmission(target.id);
      setRows((r) => r.filter((x) => x.id !== target.id));
      toast.success('Admission deleted');
      setTarget(null);
    } catch (e) {
      toast.error(errorMessage(e, 'Delete failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell embedded={embedded} title="Admissions">
      <DataTable
        rows={rows}
        searchKeys={['student_name', 'class_applied']}
        toolbar={<button className="btn-gold" onClick={exportCsv} disabled={!rows.length}><Download size={16} /> Export CSV</button>}
        columns={[
          { key: 'n', label: '#', render: (_, i) => i + 1 },
          { key: 'student_name', label: 'Student Name' },
          { key: 'parent_name', label: 'Parent Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'class_applied', label: 'Class' },
          { key: 'submitted_at', label: 'Submitted At' },
        ]}
        actions={(row) => (
          <button className="text-red-600 hover:text-red-800" onClick={() => setTarget(row)} aria-label="Delete"><Trash2 size={16} /></button>
        )}
      />
      <Modal
        open={!!target}
        title="Delete admission?"
        onClose={() => setTarget(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setTarget(null)}>Cancel</button>
          <button className="btn-danger" onClick={confirmDelete} disabled={busy}>Delete</button>
        </>}
      >
        This will permanently delete the enquiry from <b>{target?.student_name}</b>.
      </Modal>
    </PageShell>
  );
}
