import React, { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';
import { toast } from 'sonner';

const COLORS = {
    surface: '#ffffff',
    surface2: '#f0efed',
    border: '#e4e2dd',
    text: '#1a1816',
    muted: '#7c7568',
    gold: '#C9A84C',
    goldBright: '#D4AF37',
    goldSoft: 'rgba(201,168,76,0.12)',
    green: '#059669',
    amber: '#d97706',
    rust: '#dc2626',
};
const fontDisplay = "'Inter', sans-serif";
const fontBody = "'Inter', sans-serif";
const fontMono = "'JetBrains Mono', monospace";

const cardStyle = { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' };
const thStyle = { textAlign: 'left', padding: '13px 18px', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.muted, fontWeight: 700, borderBottom: `1px solid ${COLORS.border}`, whiteSpace: 'nowrap', background: COLORS.surface2 };
const tdStyle = { padding: '15px 18px', borderBottom: `1px solid ${COLORS.border}`, color: COLORS.text, fontSize: 14, verticalAlign: 'middle' };
const btnPrimary = { background: `linear-gradient(135deg, ${COLORS.goldBright}, ${COLORS.gold})`, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: fontBody };

function EmptyRow({ text }) {
    return (
        <div style={{ padding: '48px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◇</div>
            <div style={{ color: COLORS.muted, fontSize: 13, fontWeight: 500 }}>{text}</div>
        </div>
    );
}

function PageHeader({ eyebrow, title, action = null }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 28, padding: '4px 0 20px', borderBottom: `1px solid ${COLORS.border}` }}>
            <div>
                <div style={{ fontSize: 11, letterSpacing: '0.18em', color: COLORS.gold, textTransform: 'uppercase', marginBottom: 5, fontWeight: 700 }}>{eyebrow}</div>
                <h1 style={{ fontFamily: fontDisplay, fontSize: 28, fontWeight: 700, color: COLORS.text, margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
            </div>
            {action && <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>{action}</div>}
        </div>
    );
}

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadInquiries = async () => {
        setLoading(true);
        // We do a left join with escalations to show draft replies if they exist
        const { data, error } = await supabase
            .from('inquiries')
            .select(`
                *,
                escalations ( id, ai_draft_reply, client_reply, resolved )
            `)
            .order('created_at', { ascending: false });
        
        if (error) {
            toast.error('Failed to load inquiries: ' + error.message);
        } else {
            setInquiries(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadInquiries();
    }, []);

    const handleResolve = async (escalationId, inquiryId, draftReply) => {
        const clientReply = prompt("Edit reply to customer:", draftReply || "");
        if (clientReply === null) return; // cancelled

        const { error: escError } = await supabase
            .from('escalations')
            .update({ resolved: true, client_reply: clientReply, resolved_at: new Date().toISOString() })
            .eq('id', escalationId);
        
        if (escError) { toast.error(escError.message); return; }

        const { error: inqError } = await supabase
            .from('inquiries')
            .update({ status: 'resolved' })
            .eq('id', inquiryId);

        if (inqError) { toast.error(inqError.message); return; }

        toast.success("Reply recorded and inquiry resolved.");
        loadInquiries();
    };

    if (loading) return <div style={{ padding: 48, textAlign: 'center', color: COLORS.muted }}>Loading Inquiries...</div>;

    return (
        <div>
            <PageHeader eyebrow="Customer Care" title="Inquiries & Escalations" />
            
            <div style={cardStyle}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Date</th>
                                <th style={thStyle}>Customer</th>
                                <th style={thStyle}>Message</th>
                                <th style={thStyle}>Status</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.length === 0 && <tr><td colSpan={5}><EmptyRow text="No inquiries yet." /></td></tr>}
                            {inquiries.map(inq => {
                                const escalation = inq.escalations?.[0];
                                
                                let statusColor = COLORS.muted;
                                if (inq.status === 'new') statusColor = COLORS.gold;
                                if (inq.status === 'auto_handled' || inq.status === 'resolved') statusColor = COLORS.green;
                                if (inq.status === 'escalated') statusColor = COLORS.rust;

                                return (
                                    <tr key={inq.id}>
                                        <td style={{ ...tdStyle, fontSize: 13, color: COLORS.muted }}>
                                            {new Date(inq.created_at).toLocaleDateString()}<br/>
                                            {new Date(inq.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: 600 }}>{inq.customer_name || 'Anonymous'}</div>
                                            <div style={{ fontSize: 12, color: COLORS.muted }}>{inq.customer_contact}</div>
                                            <div style={{ fontSize: 10, marginTop: 4, textTransform: 'uppercase', color: COLORS.gold }}>via {inq.source}</div>
                                        </td>
                                        <td style={{ ...tdStyle, maxWidth: 300 }}>
                                            <div style={{ fontSize: 13, lineHeight: 1.5 }}>"{inq.message}"</div>
                                            {inq.status === 'escalated' && escalation && !escalation.resolved && (
                                                <div style={{ marginTop: 8, padding: '8px 10px', background: COLORS.rust + '10', borderLeft: `2px solid ${COLORS.rust}`, fontSize: 12 }}>
                                                    <strong>AI Draft:</strong> {escalation.ai_draft_reply}
                                                </div>
                                            )}
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, color: statusColor, background: statusColor + '15', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {inq.status}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                            {inq.status === 'escalated' && escalation && !escalation.resolved && (
                                                <button style={btnPrimary} onClick={() => handleResolve(escalation.id, inq.id, escalation.ai_draft_reply)}>
                                                    Review & Reply
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
