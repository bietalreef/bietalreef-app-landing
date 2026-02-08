import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, Trash2, Upload, Eye, Copy, Share2,
  Building2, Globe, Phone, Mail, MapPin, User,
  FileText, CreditCard, Shield, Printer, Calendar, Download,
  Wrench, Paintbrush, HardHat, Sparkles, Compass, Package,
} from 'lucide-react';
import {
  SimpleToolShell, InputCard, InputField, ActionButton,
  OptionSelector, formatAED,
} from './SimpleToolShell';
import { CollapsibleSection } from './CollapsibleSection';
import { useLanguage } from '../../../contexts/LanguageContext';
import { downloadPdfFromElement } from './pdfExport';
import { Icon3D } from '../../ui/Icon3D';

/* ── أنواع العقود ── */
type ContractType = 'maintenance' | 'renovation' | 'construction' | 'cleaning' | 'consulting' | 'supply';

const CONTRACT_TYPES_AR: { id: ContractType; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'maintenance', label: 'صيانة', icon: <Icon3D icon={Wrench} theme="green" size="xs" hoverable={false} />, desc: 'عقد صيانة منزلية' },
  { id: 'renovation', label: 'تجديد', icon: <Icon3D icon={Paintbrush} theme="pink" size="xs" hoverable={false} />, desc: 'عقد تجديد وترميم' },
  { id: 'construction', label: 'بناء', icon: <Icon3D icon={HardHat} theme="orange" size="xs" hoverable={false} />, desc: 'عقد مقاولات بناء' },
  { id: 'cleaning', label: 'تنظيف', icon: <Icon3D icon={Sparkles} theme="cyan" size="xs" hoverable={false} />, desc: 'عقد خدمات تنظيف' },
  { id: 'consulting', label: 'استشارات', icon: <Icon3D icon={Compass} theme="blue" size="xs" hoverable={false} />, desc: 'عقد استشارات هندسية' },
  { id: 'supply', label: 'توريد', icon: <Icon3D icon={Package} theme="brown" size="xs" hoverable={false} />, desc: 'عقد توريد مواد' },
];
const CONTRACT_TYPES_EN: { id: ContractType; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'maintenance', label: 'Maintenance', icon: <Icon3D icon={Wrench} theme="green" size="xs" hoverable={false} />, desc: 'Home maintenance' },
  { id: 'renovation', label: 'Renovation', icon: <Icon3D icon={Paintbrush} theme="pink" size="xs" hoverable={false} />, desc: 'Renovation & restoration' },
  { id: 'construction', label: 'Construction', icon: <Icon3D icon={HardHat} theme="orange" size="xs" hoverable={false} />, desc: 'Construction contracting' },
  { id: 'cleaning', label: 'Cleaning', icon: <Icon3D icon={Sparkles} theme="cyan" size="xs" hoverable={false} />, desc: 'Cleaning services' },
  { id: 'consulting', label: 'Consulting', icon: <Icon3D icon={Compass} theme="blue" size="xs" hoverable={false} />, desc: 'Engineering consulting' },
  { id: 'supply', label: 'Supply', icon: <Icon3D icon={Package} theme="brown" size="xs" hoverable={false} />, desc: 'Material supply' },
];

/* ── بنود العقد ── */
interface ContractClause {
  id: string;
  title: string;
  content: string;
}

/* ── دفعات العقد ── */
interface ContractPayment {
  id: string;
  label: string;
  percentage: number;
  milestone: string;
}

/* ── الشروط الافتراضية ── */
const getDefaultClauses = (isEn: boolean, warranty: string, penalty: string): ContractClause[] => [
  { id: '1', title: isEn ? 'Work Commitment' : 'التزام العمل', content: isEn ? 'The Second Party commits to completing all agreed works within the specified timeline, in accordance with the approved specifications and standards.' : 'يلتزم الطرف الثاني بإنجاز الأعمال المتفق عليها في المدة المحددة وفقاً للمواصفات والمعايير المعتمدة.' },
  { id: '2', title: isEn ? 'Delay Penalty' : 'غرامة التأخير', content: isEn ? `In case of delay, the First Party may deduct a daily penalty of ${penalty}% of the contract value.` : `في حال التأخير، يحق للطرف الأول خصم غرامة يومية بنسبة ${penalty}% من قيمة العقد.` },
  { id: '3', title: isEn ? 'Warranty' : 'الضمان', content: isEn ? `The Second Party guarantees the quality of work for ${warranty} months from the handover date.` : `يضمن الطرف الثاني جودة الأعمال لمدة ${warranty} أشهر من تاريخ التسليم.` },
  { id: '4', title: isEn ? 'Additional Works' : 'الأعمال الإضافية', content: isEn ? 'Any additional works must be agreed upon in writing and added to the contract value.' : 'أي أعمال إضافية يتم الاتفاق عليها كتابياً وتُضاف لقيمة العقد.' },
  { id: '5', title: isEn ? 'Dispute Resolution' : 'حل النزاعات', content: isEn ? 'In case of dispute, it shall be resolved amicably or through the competent authorities in the UAE.' : 'في حال النزاع، يتم حله ودياً أو عبر الجهات المختصة في الإمارات العربية المتحدة.' },
  { id: '6', title: isEn ? 'Termination' : 'إنهاء العقد', content: isEn ? 'Either party may terminate the contract with 15 days written notice, with settlement of completed works.' : 'يحق لأي طرف إنهاء العقد بإشعار كتابي قبل 15 يوماً، مع تسوية الأعمال المنجزة.' },
];

/* ═══════════════════════════════════════════════════════ */
export function ContractGeneratorTool({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const CONTRACT_TYPES = isEn ? CONTRACT_TYPES_EN : CONTRACT_TYPES_AR;

  /* ── نوع العقد ── */
  const [contractType, setContractType] = useState<ContractType>('maintenance');

  /* ── بيانات الطرف الأول (العميل) ── */
  const [party1Name, setParty1Name] = useState('');
  const [party1Phone, setParty1Phone] = useState('');
  const [party1Email, setParty1Email] = useState('');
  const [party1ID, setParty1ID] = useState('');
  const [party1Address, setParty1Address] = useState('');

  /* ── بيانات الطرف الثاني (المزود) ── */
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [party2Name, setParty2Name] = useState('');
  const [party2Phone, setParty2Phone] = useState('');
  const [party2Email, setParty2Email] = useState('');
  const [party2License, setParty2License] = useState('');
  const [party2Address, setParty2Address] = useState('');
  const [party2Website, setParty2Website] = useState('');

  /* ── تفاصيل المشروع ── */
  const [projectDesc, setProjectDesc] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [includeVAT, setIncludeVAT] = useState(true);

  /* ── الضمان والغرامات ── */
  const [warranty, setWarranty] = useState('6');
  const [penalty, setPenalty] = useState('0.5');

  /* ── الدفعات ── */
  const [payments, setPayments] = useState<ContractPayment[]>([
    { id: '1', label: isEn ? 'Down Payment' : 'دفعة مقدمة', percentage: 30, milestone: isEn ? 'Upon signing' : 'عند توقيع العقد' },
    { id: '2', label: isEn ? 'Progress Payment' : 'دفعة تقدم', percentage: 40, milestone: isEn ? 'At 50% completion' : 'عند إنجاز 50%' },
    { id: '3', label: isEn ? 'Final Payment' : 'دفعة نهائية', percentage: 30, milestone: isEn ? 'Upon handover' : 'عند التسليم' },
  ]);

  /* ── البنود ── */
  const [clauses, setClauses] = useState<ContractClause[]>(getDefaultClauses(isEn, warranty, penalty));
  const [newClauseTitle, setNewClauseTitle] = useState('');
  const [newClauseContent, setNewClauseContent] = useState('');

  /* ── حالة العرض ── */
  const [showPreview, setShowPreview] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    type: true, party1: true, party2: true, project: true, payments: false, clauses: false,
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const contractNumber = `BR-C-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const today = new Date().toLocaleDateString(isEn ? 'en-US' : 'ar-AE', { year: 'numeric', month: 'long', day: 'numeric' });

  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  /* ── رفع الشعار ── */
  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert(isEn ? 'Logo must be < 2MB' : 'الشعار يجب أن يكون أقل من 2 ميجابايت'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setCompanyLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, [isEn]);

  /* ── إدارة الدفعات ── */
  const addPayment = () => setPayments(prev => [...prev, { id: String(Date.now()), label: isEn ? `Payment ${prev.length + 1}` : `دفعة ${prev.length + 1}`, percentage: 0, milestone: '' }]);
  const removePayment = (id: string) => { if (payments.length > 1) setPayments(prev => prev.filter(p => p.id !== id)); };
  const updatePayment = (id: string, field: keyof ContractPayment, value: any) => setPayments(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  const totalPaymentPct = payments.reduce((s, p) => s + p.percentage, 0);

  /* ── إدارة البنود ── */
  const addClause = () => {
    if (newClauseTitle.trim() && newClauseContent.trim()) {
      setClauses(prev => [...prev, { id: String(Date.now()), title: newClauseTitle.trim(), content: newClauseContent.trim() }]);
      setNewClauseTitle(''); setNewClauseContent('');
    }
  };
  const removeClause = (id: string) => setClauses(prev => prev.filter(c => c.id !== id));

  const total = Number(totalAmount) || 0;
  const vat = includeVAT ? Math.round(total * 0.05) : 0;
  const grandTotal = total + vat;

  /* ── إنشاء العقد ── */
  const handleGenerate = () => {
    if (!party1Name && !party2Name) { alert(isEn ? 'Please enter at least one party name' : 'يرجى إدخال اسم طرف واحد على الأقل'); return; }
    setShowPreview(true);
  };

  /* ── طباعة ── */
  const handlePrint = () => {
    if (!previewRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>${isEn ? 'Contract' : 'عقد'} - ${contractNumber}</title><style>@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Cairo',sans-serif;direction:rtl}@page{size:A4;margin:0}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>${previewRef.current.innerHTML}</body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  /* ── نص العقد ── */
  const getContractText = () => {
    const typeLabel = CONTRACT_TYPES.find(t => t.id === contractType)?.label || '';
    let text = `═══════════════════════\n📝 ${isEn ? 'Contract' : 'عقد'} ${typeLabel} | ${contractNumber}\n═══════════════════════\n📅 ${today}\n\n`;
    text += `${isEn ? 'First Party (Client)' : 'الطرف الأول (العميل)'}:\n${party1Name || '___'}${party1Phone ? ` | 📞 ${party1Phone}` : ''}\n\n`;
    text += `${isEn ? 'Second Party (Provider)' : 'الطرف الثاني (المزود)'}:\n${party2Name || '___'}${party2Phone ? ` | 📞 ${party2Phone}` : ''}\n\n`;
    text += `${isEn ? 'Scope of Work' : 'نطاق العمل'}:\n${projectDesc || '---'}\n\n`;
    text += `${isEn ? 'Total Value' : 'القيمة الإجمالية'}: ${formatAED(grandTotal)}\n`;
    text += `${isEn ? 'Duration' : 'المدة'}: ${duration || '___'} ${isEn ? 'days' : 'يوم'}\n`;
    text += `${isEn ? 'Warranty' : 'الضمان'}: ${warranty} ${isEn ? 'months' : 'أشهر'}\n\n`;
    if (payments.length > 0) {
      text += `💳 ${isEn ? 'Payment Schedule' : 'جدول الدفعات'}:\n`;
      payments.forEach(p => { text += `• ${p.label}: ${p.percentage}% (${formatAED(Math.round(grandTotal * p.percentage / 100))}) - ${p.milestone}\n`; });
      text += '\n';
    }
    clauses.forEach((c, i) => { text += `${i + 1}. ${c.title}: ${c.content}\n`; });
    text += `\n───────────────────────\n${isEn ? 'Beit Al Reef | Home Services Platform' : 'بيت الريف | منصة الخدمات المنزلية'}`;
    return text;
  };

  // Labels
  const L = {
    title: isEn ? 'Contract Generator' : 'مولّد العقود',
    subtitle: isEn ? 'Create a professional A4 service contract' : 'أنشئ عقد خدمة احترافي يطابق نموذج A4',
    contractType: isEn ? 'Contract Type' : 'نوع العقد',
    selectType: isEn ? 'Select contract type' : 'اختر نوع العقد',
    party1: isEn ? 'First Party (Client)' : 'الطرف الأول (العميل)',
    party2: isEn ? 'Second Party (Provider)' : 'الطرف الثاني (المزود/المقاول)',
    name: isEn ? 'Full Name' : 'الاسم الكامل',
    phone: isEn ? 'Phone' : 'الهاتف',
    email: isEn ? 'Email' : 'البريد الإلكتروني',
    idNum: isEn ? 'Emirates ID / Passport' : 'رقم الهوية / الجواز',
    address: isEn ? 'Address' : 'العنوان',
    license: isEn ? 'Trade License No.' : 'رقم الرخصة التجارية',
    website: isEn ? 'Website' : 'الموقع الإلكتروني',
    logo: isEn ? 'Company Logo' : 'شعار الشركة',
    uploadLogo: isEn ? 'Upload' : 'رفع',
    removeLogo: isEn ? 'Remove' : 'إزالة',
    projectDetails: isEn ? 'Project & Financial Details' : 'تفاصيل المشروع والشروط المالية',
    scopeOfWork: isEn ? 'Scope of Work' : 'وصف الأعمال',
    location: isEn ? 'Project Location' : 'موقع المشروع',
    startDate: isEn ? 'Start Date' : 'تاريخ البدء',
    durationDays: isEn ? 'Duration (days)' : 'مدة التنفيذ (يام)',
    totalValue: isEn ? 'Total Value (AED)' : 'القيمة الإجمالية (د.إ)',
    addVat: isEn ? 'Add VAT (5%)' : 'إضافة الضريبة (5%)',
    warrantyLabel: isEn ? 'Warranty Period' : 'فترة الضمان',
    penaltyLabel: isEn ? 'Daily Penalty %' : 'نسبة الغرامة اليومية %',
    paymentsTitle: isEn ? 'Payment Schedule' : 'جدول الدفعات',
    addPayment: isEn ? 'Add Payment' : 'إضافة دفعة',
    clausesTitle: isEn ? 'Contract Clauses' : 'بنود العقد',
    clauseTitlePh: isEn ? 'Clause title' : 'عنوان البند',
    clauseContentPh: isEn ? 'Clause content...' : 'نص البند...',
    addClause: isEn ? 'Add' : 'إضافة',
    generate: isEn ? 'Preview & Generate Contract' : 'معاينة وإنشاء العقد',
    previewTitle: isEn ? 'Contract Preview — A4' : 'معاينة العقد — نموذج A4',
    copy: isEn ? 'Copy' : 'نسخ',
    whatsapp: isEn ? 'WhatsApp' : 'واتساب',
    printPdf: isEn ? 'Print PDF' : 'طباعة PDF',
    savePdf: isEn ? 'Save PDF' : 'حفظ PDF',
    close: isEn ? 'Close Preview' : 'إغلاق المعاينة',
    paymentNum: isEn ? 'Payment' : 'دفعة',
    pctTotal: isEn ? 'Total' : 'المجموع',
    must100: isEn ? '(must be 100%)' : '(يجب أن يكون 100%)',
    a4: {
      contract: isEn ? 'SERVICE CONTRACT' : 'عقد خدمة',
      contractSub: isEn ? '' : 'SERVICE CONTRACT',
      contractNum: isEn ? 'Contract No.' : 'رقم العقد',
      party1: isEn ? 'FIRST PARTY (CLIENT)' : '��لطرف الأول (العميل)',
      party2: isEn ? 'SECOND PARTY (PROVIDER)' : 'الطرف الثاني (المزود)',
      scope: isEn ? '📋 Scope of Work' : '📋 نطاق العمل',
      financial: isEn ? '💰 Financial Terms' : '💰 الشروط المالية',
      subtotal: isEn ? 'Contract Value' : 'قيمة العقد',
      vat: isEn ? 'VAT (5%)' : 'الضريبة (5%)',
      grandTotal: isEn ? 'Grand Total' : 'الإجمالي',
      duration: isEn ? 'Duration' : 'المدة',
      days: isEn ? 'days' : 'يوم',
      warranty: isEn ? 'Warranty' : 'لضمان',
      months: isEn ? 'months' : 'أشهر',
      penalty: isEn ? 'Delay Penalty' : 'غرامة التأخير',
      daily: isEn ? '/ day' : '/ يوم',
      paySchedule: isEn ? '💳 Payment Schedule' : '💳 جدول الدفعات',
      payLabel: isEn ? 'Payment' : 'الدفعة',
      pct: isEn ? '%' : 'النسبة',
      amount: isEn ? 'Amount' : 'المبلغ',
      milestone: isEn ? 'Milestone' : 'المرحلة',
      clauses: isEn ? '📜 Terms & Conditions' : '📜 الشروط والأحكام',
      signatures: isEn ? 'Signatures' : 'التوقيعات',
      signStamp: isEn ? 'Signature & Stamp' : 'التوقيع والختم',
      footer: isEn ? 'Generated via Beit Al Reef — bietalreef.ae' : 'تم إنشاء هذا العقد عبر منصة بيت الريف — bietalreef.ae',
      page: isEn ? 'Page 1 of 1' : 'صفحة 1 من 1',
    },
  };

  return (
    <SimpleToolShell title={L.title} subtitle={L.subtitle} toolId="contract" gradientFrom="#7C3AED" gradientTo="#A78BFA" onBack={onBack}>
      {/* 1. نوع العقد */}
      <InputCard title={isEn ? 'Contract Type' : 'نوع العقد'}>
        <OptionSelector label={L.selectType} options={CONTRACT_TYPES} value={contractType} onChange={(v) => setContractType(v as ContractType)} />
      </InputCard>

      {/* 2. الطرف الأول */}
      <CollapsibleSection isOpen={!!expandedSections.party1} onToggle={() => toggleSection('party1')} title={L.party1} icon={<User className="w-4 h-4 text-green-500" />}>
        <InputField label={L.name} value={party1Name} onChange={setParty1Name} type="text" placeholder={isEn ? 'Client full name' : 'اسم العميل الكامل'} />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Phone className="w-3 h-3 inline ml-1" />{L.phone}</label><input type="tel" value={party1Phone} onChange={e => setParty1Phone(e.target.value)} placeholder="05X XXX XXXX" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-purple-400 font-cairo" dir="ltr" /></div>
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Mail className="w-3 h-3 inline ml-1" />{L.email}</label><input type="email" value={party1Email} onChange={e => setParty1Email(e.target.value)} placeholder="client@email.com" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-purple-400 font-cairo" dir="ltr" /></div>
        </div>
        <div className="mt-3"><InputField label={L.idNum} value={party1ID} onChange={setParty1ID} type="text" placeholder={isEn ? '784-XXXX-XXXXXXX-X' : '784-XXXX-XXXXXXX-X'} /></div>
        <div className="mt-1"><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><MapPin className="w-3 h-3 inline ml-1" />{L.address}</label><input type="text" value={party1Address} onChange={e => setParty1Address(e.target.value)} placeholder={isEn ? 'Client address' : 'عنوان العميل'} className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-purple-400 font-cairo" /></div>
      </CollapsibleSection>

      {/* 3. الطرف الثاني */}
      <CollapsibleSection isOpen={!!expandedSections.party2} onToggle={() => toggleSection('party2')} title={L.party2} icon={<Building2 className="w-4 h-4 text-purple-500" />}>
        {/* Logo */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-500 mb-2 font-cairo">{L.logo}</label>
          <div className="flex items-center gap-3">
            <button onClick={() => logoInputRef.current?.click()} className="relative w-16 h-16 rounded-2xl border-[4px] border-dashed border-gray-300/60 bg-gray-50 flex flex-col items-center justify-center hover:border-purple-400 transition-all overflow-hidden group">
              {companyLogo ? (<><img src={companyLogo} alt="" className="w-full h-full object-contain p-1" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Upload className="w-4 h-4 text-white" /></div></>) : (<><Upload className="w-4 h-4 text-gray-400" /><span className="text-[8px] text-gray-400 font-cairo">{L.uploadLogo}</span></>)}
            </button>
            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            {companyLogo && <button onClick={() => setCompanyLogo(null)} className="text-red-400 text-xs font-cairo underline">{L.removeLogo}</button>}
          </div>
        </div>
        <InputField label={L.name} value={party2Name} onChange={setParty2Name} type="text" placeholder={isEn ? 'Company / Provider name' : 'اسم الشركة / المقاول'} />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Phone className="w-3 h-3 inline ml-1" />{L.phone}</label><input type="tel" value={party2Phone} onChange={e => setParty2Phone(e.target.value)} placeholder="05X XXX XXXX" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-purple-400 font-cairo" dir="ltr" /></div>
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Mail className="w-3 h-3 inline ml-1" />{L.email}</label><input type="email" value={party2Email} onChange={e => setParty2Email(e.target.value)} placeholder="info@company.ae" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-purple-400 font-cairo" dir="ltr" /></div>
        </div>
        <div className="mt-3"><InputField label={L.license} value={party2License} onChange={setParty2License} type="text" placeholder={isEn ? 'License number' : 'رقم الرخصة'} /></div>
        <div className="mt-1"><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Globe className="w-3 h-3 inline ml-1" />{L.website}</label><input type="url" value={party2Website} onChange={e => setParty2Website(e.target.value)} placeholder="www.company.ae" className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-purple-400 font-cairo" dir="ltr" /></div>
        <div className="mt-3"><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><MapPin className="w-3 h-3 inline ml-1" />{L.address}</label><input type="text" value={party2Address} onChange={e => setParty2Address(e.target.value)} placeholder={isEn ? 'Company address' : 'عنوان الشركة'} className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-purple-400 font-cairo" /></div>
      </CollapsibleSection>

      {/* 4. تفاصيل المشروع */}
      <CollapsibleSection isOpen={!!expandedSections.project} onToggle={() => toggleSection('project')} title={L.projectDetails} icon={<FileText className="w-4 h-4 text-blue-500" />}>
        <div className="mb-3"><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo">{L.scopeOfWork}</label><textarea value={projectDesc} onChange={e => setProjectDesc(e.target.value)} placeholder={isEn ? 'Describe the work in detail...' : 'صف الأعمال المطلوبة بالتفصيل...'} className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-purple-400 font-cairo h-28 resize-none" /></div>
        <InputField label={L.location} value={projectLocation} onChange={setProjectLocation} type="text" placeholder={isEn ? 'e.g. Dubai - Al Barsha' : 'مثال: دبي - البرشاء'} />
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-bold text-gray-500 mb-1.5 font-cairo"><Calendar className="w-3 h-3 inline ml-1" />{L.startDate}</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 bg-gray-50/80 rounded-xl border-[4px] border-gray-200/60 text-sm outline-none focus:border-purple-400 font-cairo" /></div>
          <InputField label={L.durationDays} value={duration} onChange={setDuration} type="number" placeholder="30" suffix={isEn ? 'days' : 'يوم'} />
        </div>
        <InputField label={L.totalValue} value={totalAmount} onChange={setTotalAmount} type="number" placeholder="0" suffix={isEn ? 'AED' : 'د.إ'} />
        <button onClick={() => setIncludeVAT(!includeVAT)} className={`w-full flex items-center justify-between p-3 rounded-xl border-[4px] transition-all mb-3 ${includeVAT ? 'border-purple-400 bg-purple-50' : 'border-gray-200/60 bg-white'}`}>
          <span className="font-cairo font-bold text-sm text-gray-700">{L.addVat}</span>
          <div className={`w-12 h-7 rounded-full relative transition-colors ${includeVAT ? 'bg-purple-500' : 'bg-gray-300'}`}><div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${includeVAT ? 'right-0.5' : 'left-0.5'}`} /></div>
        </button>
        {total > 0 && (<div className="bg-purple-50 rounded-xl p-3"><div className="flex justify-between text-sm font-cairo mb-1"><span className="text-gray-500">{isEn ? 'Subtotal' : 'المجموع'}</span><span className="font-bold">{formatAED(total)}</span></div>{includeVAT && <div className="flex justify-between text-sm font-cairo mb-1"><span className="text-gray-500">{isEn ? 'VAT 5%' : 'ضريبة 5%'}</span><span className="font-bold">{formatAED(vat)}</span></div>}<div className="flex justify-between text-sm font-cairo font-bold border-t border-purple-200 pt-1"><span>{isEn ? 'Total' : 'الإجمالي'}</span><span className="text-purple-700">{formatAED(grandTotal)}</span></div></div>)}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <OptionSelector label={L.warrantyLabel} options={[{ id: '0', label: isEn ? 'None' : 'بدون' }, { id: '3', label: isEn ? '3 Mo' : '3 أشهر' }, { id: '6', label: isEn ? '6 Mo' : '6 أشهر' }, { id: '12', label: isEn ? '1 Year' : 'سنة' }]} value={warranty} onChange={setWarranty} />
          <InputField label={L.penaltyLabel} value={penalty} onChange={setPenalty} type="number" placeholder="0.5" suffix="%" />
        </div>
      </CollapsibleSection>

      {/* 5. الدفعات */}
      <CollapsibleSection isOpen={!!expandedSections.payments} onToggle={() => toggleSection('payments')} title={L.paymentsTitle} icon={<CreditCard className="w-4 h-4 text-amber-500" />} badge={`${payments.length} ${isEn ? 'payments' : 'دفعات'}`}>
        <div className="space-y-3">
          {payments.map((p, idx) => (
            <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-amber-50/50 rounded-xl p-3 border-[4px] border-amber-100/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-600 font-cairo">{L.paymentNum} #{idx + 1}</span>
                {payments.length > 1 && <button onClick={() => removePayment(p.id)} className="w-6 h-6 rounded-full bg-red-50 text-red-400 flex items-center justify-center"><Trash2 className="w-3 h-3" /></button>}
              </div>
              <div className="grid grid-cols-12 gap-2">
                <input type="text" value={p.label} onChange={e => updatePayment(p.id, 'label', e.target.value)} className="col-span-4 p-2 bg-white rounded-lg border-[4px] border-gray-200/60 text-xs font-cairo outline-none" />
                <div className="col-span-3 relative"><input type="number" value={p.percentage || ''} onChange={e => updatePayment(p.id, 'percentage', Number(e.target.value) || 0)} className="w-full p-2 bg-white rounded-lg border-[4px] border-gray-200/60 text-xs font-cairo outline-none text-center" min={0} max={100} /><span className="absolute left-2 top-2 text-[10px] text-gray-400">%</span></div>
                <input type="text" value={p.milestone} onChange={e => updatePayment(p.id, 'milestone', e.target.value)} placeholder={isEn ? 'Milestone...' : 'عند...'} className="col-span-5 p-2 bg-white rounded-lg border-[4px] border-gray-200/60 text-xs font-cairo outline-none" />
              </div>
            </motion.div>
          ))}
        </div>
        <button onClick={addPayment} className="w-full mt-3 py-2.5 border-[4px] border-dashed border-amber-300 rounded-xl text-amber-600 font-bold font-cairo text-xs flex items-center justify-center gap-2 hover:bg-amber-50 transition-colors"><Plus className="w-3.5 h-3.5" />{L.addPayment}</button>
        <div className={`mt-3 text-center text-xs font-bold font-cairo py-2 rounded-lg ${Math.abs(totalPaymentPct - 100) < 0.01 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{L.pctTotal}: {totalPaymentPct}% {Math.abs(totalPaymentPct - 100) >= 0.01 && L.must100}</div>
      </CollapsibleSection>

      {/* 6. البنود */}
      <CollapsibleSection isOpen={!!expandedSections.clauses} onToggle={() => toggleSection('clauses')} title={L.clausesTitle} icon={<Shield className="w-4 h-4 text-teal-500" />} badge={`${clauses.length} ${isEn ? 'clauses' : 'بند'}`}>
        <div className="space-y-2 mb-3 max-h-60 overflow-y-auto">
          {clauses.map((c, idx) => (
            <div key={c.id} className="flex items-start gap-2 bg-teal-50/50 rounded-lg p-2.5 border-[4px] border-teal-100/60">
              <span className="text-[10px] font-bold text-teal-600 font-cairo mt-0.5 shrink-0">{idx + 1}.</span>
              <div className="flex-1 min-w-0"><p className="text-xs font-bold text-gray-800 font-cairo">{c.title}</p><p className="text-[11px] text-gray-600 font-cairo leading-relaxed">{c.content}</p></div>
              <button onClick={() => removeClause(c.id)} className="w-5 h-5 rounded-full bg-red-50 text-red-400 flex items-center justify-center shrink-0 mt-0.5"><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <input type="text" value={newClauseTitle} onChange={e => setNewClauseTitle(e.target.value)} placeholder={L.clauseTitlePh} className="w-full p-2.5 bg-gray-50 rounded-xl border-[4px] border-gray-200/60 text-xs outline-none focus:border-teal-400 font-cairo" />
          <textarea value={newClauseContent} onChange={e => setNewClauseContent(e.target.value)} placeholder={L.clauseContentPh} className="w-full p-2.5 bg-gray-50 rounded-xl border-[4px] border-gray-200/60 text-xs outline-none focus:border-teal-400 font-cairo h-16 resize-none" />
          <button onClick={addClause} className="w-full py-2 bg-teal-500 text-white rounded-xl text-xs font-bold font-cairo hover:bg-teal-600 transition-colors">{L.addClause}</button>
        </div>
      </CollapsibleSection>

      {/* Generate */}
      <div className="mb-4"><ActionButton onClick={handleGenerate} text={L.generate} /></div>

      {/* ═══════════ A4 Preview ═══════════ */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto py-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-gray-100 w-full max-w-[650px] mx-2 rounded-2xl overflow-hidden shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex items-center justify-between z-20">
                <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-purple-500" /><h3 className="font-bold text-sm font-cairo text-[#1A1A1A]">{L.previewTitle}</h3></div>
                <div className="flex items-center gap-2"><button onClick={handlePrint} className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center hover:bg-purple-100"><Printer className="w-4 h-4 text-purple-600" /></button><button onClick={() => setShowPreview(false)} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"><X className="w-4 h-4 text-gray-500" /></button></div>
              </div>
              <div className="p-3">
                <div ref={previewRef} style={{ width: '100%', maxWidth: '595px', minHeight: '842px', margin: '0 auto', background: '#fff', fontFamily: 'Cairo, sans-serif', direction: 'rtl', fontSize: '10px', lineHeight: '1.6', color: '#1A1A1A', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                  {/* Header */}
                  <div style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {companyLogo && <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '3px' }}><img src={companyLogo} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /></div>}
                      <div><div style={{ color: '#fff', fontWeight: 800, fontSize: '15px' }}>{party2Name || (isEn ? 'Company Name' : 'اسم الشركة')}</div>{party2Address && <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '9px' }}>📍 {party2Address}</div>}</div>
                    </div>
                    <div style={{ textAlign: 'left', color: 'rgba(255,255,255,0.9)', fontSize: '9px', lineHeight: '1.8' }}>
                      {party2Phone && <div>📞 {party2Phone}</div>}
                      {party2Email && <div>✉️ {party2Email}</div>}
                      {party2Website && <div>🌐 {party2Website}</div>}
                      {party2License && <div>🏷️ {party2License}</div>}
                    </div>
                  </div>
                  {/* Title */}
                  <div style={{ background: '#F5F3FF', borderBottom: '2px solid #E9E5FF', padding: '12px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><div style={{ fontWeight: 800, fontSize: '17px', color: '#5B21B6' }}>{L.a4.contract}</div>{L.a4.contractSub && <div style={{ fontSize: '10px', color: '#7C3AED' }}>{L.a4.contractSub}</div>}<div style={{ fontSize: '9px', color: '#64748B', marginTop: '2px' }}>{CONTRACT_TYPES.find(t => t.id === contractType)?.label}</div></div>
                    <div style={{ textAlign: 'left' }}><div style={{ fontSize: '10px', color: '#64748B' }}>{L.a4.contractNum}</div><div style={{ fontWeight: 700, fontSize: '12px', color: '#5B21B6' }}>{contractNumber}</div><div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>📅 {today}</div></div>
                  </div>
                  {/* Parties */}
                  <div style={{ padding: '14px 28px 0' }}>
                    <div style={{ display: 'flex', gap: '14px' }}>
                      <div style={{ flex: 1, background: '#F8FAFC', borderRadius: '8px', padding: '10px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>{L.a4.party1}</div>
                        <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '2px' }}>{party1Name || '___'}</div>
                        {party1Phone && <div style={{ fontSize: '9px', color: '#64748B' }}>📞 {party1Phone}</div>}
                        {party1Email && <div style={{ fontSize: '9px', color: '#64748B' }}>✉️ {party1Email}</div>}
                        {party1ID && <div style={{ fontSize: '9px', color: '#64748B' }}>🆔 {party1ID}</div>}
                        {party1Address && <div style={{ fontSize: '9px', color: '#64748B' }}>📍 {party1Address}</div>}
                      </div>
                      <div style={{ flex: 1, background: '#F8FAFC', borderRadius: '8px', padding: '10px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '8px', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>{L.a4.party2}</div>
                        <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '2px' }}>{party2Name || '___'}</div>
                        {party2Phone && <div style={{ fontSize: '9px', color: '#64748B' }}>📞 {party2Phone}</div>}
                        {party2Email && <div style={{ fontSize: '9px', color: '#64748B' }}>✉️ {party2Email}</div>}
                        {party2License && <div style={{ fontSize: '9px', color: '#64748B' }}>🏷️ {party2License}</div>}
                        {party2Address && <div style={{ fontSize: '9px', color: '#64748B' }}>📍 {party2Address}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Scope */}
                  {projectDesc && <div style={{ padding: '12px 28px 0' }}><div style={{ fontSize: '11px', fontWeight: 800, color: '#5B21B6', marginBottom: '6px', paddingBottom: '3px', borderBottom: '2px solid #E9E5FF' }}>{L.a4.scope}</div><div style={{ fontSize: '10px', color: '#374151', lineHeight: '1.8', background: '#FAFAFA', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>{projectDesc}</div>{projectLocation && <div style={{ fontSize: '9px', color: '#64748B', marginTop: '4px' }}>📍 {projectLocation}</div>}</div>}
                  {/* Financial */}
                  <div style={{ padding: '12px 28px 0' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#5B21B6', marginBottom: '6px', paddingBottom: '3px', borderBottom: '2px solid #E9E5FF' }}>{L.a4.financial}</div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 45%', display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}><span style={{ color: '#64748B', fontSize: '10px' }}>{L.a4.subtotal}</span><span style={{ fontWeight: 700, fontSize: '11px' }}>{formatAED(total)}</span></div>
                      {includeVAT && <div style={{ flex: '1 1 45%', display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}><span style={{ color: '#64748B', fontSize: '10px' }}>{L.a4.vat}</span><span style={{ fontWeight: 700, fontSize: '11px' }}>{formatAED(vat)}</span></div>}
                      <div style={{ flex: '1 1 45%', display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#5B21B6', color: '#fff', borderRadius: '6px', fontWeight: 800, fontSize: '12px' }}><span>{L.a4.grandTotal}</span><span>{formatAED(grandTotal)}</span></div>
                      <div style={{ flex: '1 1 45%', display: 'flex', gap: '8px' }}>
                        {duration && <div style={{ flex: 1, padding: '6px 8px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', textAlign: 'center' }}><div style={{ fontSize: '8px', color: '#94A3B8' }}>{L.a4.duration}</div><div style={{ fontWeight: 700, fontSize: '11px' }}>{duration} {L.a4.days}</div></div>}
                        {warranty !== '0' && <div style={{ flex: 1, padding: '6px 8px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', textAlign: 'center' }}><div style={{ fontSize: '8px', color: '#94A3B8' }}>{L.a4.warranty}</div><div style={{ fontWeight: 700, fontSize: '11px' }}>{warranty} {L.a4.months}</div></div>}
                      </div>
                    </div>
                  </div>
                  {/* Payments */}
                  {payments.length > 0 && <div style={{ padding: '12px 28px 0' }}><div style={{ fontSize: '11px', fontWeight: 800, color: '#5B21B6', marginBottom: '6px', paddingBottom: '3px', borderBottom: '2px solid #E9E5FF' }}>{L.a4.paySchedule}</div><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}><thead><tr style={{ background: '#F5F3FF' }}><th style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 700, color: '#5B21B6' }}>{L.a4.payLabel}</th><th style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700, color: '#5B21B6' }}>{L.a4.pct}</th><th style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700, color: '#5B21B6' }}>{L.a4.amount}</th><th style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 700, color: '#5B21B6' }}>{L.a4.milestone}</th></tr></thead><tbody>{payments.map(p => (<tr key={p.id} style={{ borderBottom: '1px solid #E2E8F0' }}><td style={{ padding: '5px 8px', fontWeight: 600 }}>{p.label}</td><td style={{ padding: '5px 8px', textAlign: 'center', color: '#7C3AED', fontWeight: 700 }}>{p.percentage}%</td><td style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 700 }}>{formatAED(Math.round(grandTotal * p.percentage / 100))}</td><td style={{ padding: '5px 8px', color: '#64748B' }}>{p.milestone}</td></tr>))}</tbody></table></div>}
                  {/* Clauses */}
                  {clauses.length > 0 && <div style={{ padding: '12px 28px 0' }}><div style={{ fontSize: '11px', fontWeight: 800, color: '#5B21B6', marginBottom: '6px', paddingBottom: '3px', borderBottom: '2px solid #E9E5FF' }}>{L.a4.clauses}</div><div style={{ fontSize: '9px', color: '#374151', lineHeight: '2' }}>{clauses.map((c, i) => (<div key={c.id} style={{ marginBottom: '4px' }}><span style={{ fontWeight: 800, color: '#5B21B6' }}>{i + 1}. {c.title}: </span><span>{c.content}</span></div>))}</div></div>}
                  {/* Signatures */}
                  <div style={{ padding: '16px 28px 0' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#5B21B6', marginBottom: '10px', paddingBottom: '3px', borderBottom: '2px solid #E9E5FF' }}>{L.a4.signatures}</div>
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '3px' }}>{L.a4.party1}</div><div style={{ fontWeight: 700, fontSize: '11px' }}>{party1Name || '___'}</div><div style={{ borderTop: '1px dashed #CBD5E1', marginTop: '28px', paddingTop: '4px', fontSize: '8px', color: '#94A3B8' }}>{L.a4.signStamp}</div></div>
                      <div style={{ flex: 1, textAlign: 'center' }}><div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '3px' }}>{L.a4.party2}</div><div style={{ fontWeight: 700, fontSize: '11px' }}>{party2Name || '___'}</div><div style={{ borderTop: '1px dashed #CBD5E1', marginTop: '28px', paddingTop: '4px', fontSize: '8px', color: '#94A3B8' }}>{L.a4.signStamp}</div></div>
                    </div>
                  </div>
                  {/* Footer */}
                  <div style={{ background: '#5B21B6', padding: '10px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}><div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px' }}>{L.a4.footer}</div><div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px' }}>{L.a4.page}</div></div>
                </div>
              </div>
              {/* Actions */}
              <div className="p-4 bg-white border-t border-gray-200 space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => { navigator.clipboard?.writeText(getContractText()).then(() => alert(isEn ? 'Contract copied!' : 'تم نسخ العقد')); }} className="flex flex-col items-center gap-1 py-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"><Copy className="w-4 h-4 text-purple-600" /><span className="text-[10px] font-bold font-cairo text-purple-700">{L.copy}</span></button>
                  <button onClick={() => { window.open(`https://wa.me/?text=${encodeURIComponent(getContractText())}`, '_blank'); }} className="flex flex-col items-center gap-1 py-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"><Share2 className="w-4 h-4 text-green-600" /><span className="text-[10px] font-bold font-cairo text-green-700">{L.whatsapp}</span></button>
                  <button onClick={() => { if (previewRef.current) downloadPdfFromElement(previewRef.current, `${isEn ? 'Contract' : 'عقد'}-${contractType}`); }} className="flex flex-col items-center gap-1 py-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"><Download className="w-4 h-4 text-red-600" /><span className="text-[10px] font-bold font-cairo text-red-700">{L.savePdf}</span></button>
                  <button onClick={handlePrint} className="flex flex-col items-center gap-1 py-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"><Printer className="w-4 h-4 text-blue-600" /><span className="text-[10px] font-bold font-cairo text-blue-700">{L.printPdf}</span></button>
                </div>
                <button onClick={() => setShowPreview(false)} className="w-full py-3 bg-gray-100 rounded-xl text-sm font-bold font-cairo text-gray-600 hover:bg-gray-200 transition-colors">{L.close}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SimpleToolShell>
  );
}