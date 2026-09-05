import React, { useState } from 'react';
import { X, Building2, FileSignature, Tag, ArrowLeftRight, UserPlus, Check } from 'lucide-react';
import { UnitItem, OfferApproval, PricingRule, TransactionHold } from '../types';

interface NewRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUnit: (unit: Partial<UnitItem>) => void;
  onCreateOffer: (offer: Partial<OfferApproval>) => void;
  onCreateRule: (rule: Partial<PricingRule>) => void;
  onCreateTransaction?: (tx: Partial<TransactionHold>) => void;
  onToast?: (msg: string) => void;
}

export const NewRecordModal: React.FC<NewRecordModalProps> = ({
  isOpen,
  onClose,
  onCreateUnit,
  onCreateOffer,
  onCreateRule,
  onCreateTransaction,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'unit' | 'offer' | 'rule'>('unit');

  // Form states
  const [unitCode, setUnitCode] = useState('');
  const [unitProject, setUnitProject] = useState('Azure Heights');
  const [unitType, setUnitType] = useState('2 Bed + M');
  const [unitArea, setUnitArea] = useState('1250');
  const [unitPrice, setUnitPrice] = useState('850000');

  const [offerClient, setOfferClient] = useState('');
  const [offerUnit, setOfferUnit] = useState('Tower B - Unit 402');
  const [offerDiscount, setOfferDiscount] = useState('5.0');
  const [offerJustification, setOfferJustification] = useState('');

  const [ruleName, setRuleName] = useState('');
  const [ruleScope, setRuleScope] = useState('Project: Azure Heights');
  const [ruleType, setRuleType] = useState<'Percentage' | 'Fixed' | 'Per Sqm'>('Percentage');
  const [ruleAdjustment, setRuleAdjustment] = useState('5');

  if (!isOpen) return null;

  const notify = (msg: string) => {
    if (onToast) onToast(msg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'unit') {
      if (!unitCode) {
        notify('Please provide a valid Unit Code');
        return;
      }
      onCreateUnit({
        code: unitCode,
        project: unitProject,
        location: `${unitProject} • Floor 18`,
        type: unitType,
        internalArea: Number(unitArea) || 1200,
        balconyArea: 150,
        basePrice: Number(unitPrice) || 800000,
        status: 'Available',
        orientation: 'South-East',
        leadCount: 1,
        imageUrl:
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        floorPlanUrl:
          'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&q=80',
        features: ['Smart Home System', 'Floor to Ceiling Glass', 'Private Terrace'],
      });
      notify(`Unit ${unitCode} created successfully!`);
    } else if (activeTab === 'offer') {
      if (!offerClient) {
        notify('Please specify a client/company name');
        return;
      }
      const disc = Number(offerDiscount) || 5.0;
      const base = 1250000;
      const discAmt = (base * disc) / 100;
      onCreateOffer({
        offerCode: `OFF-2023-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: offerClient,
        unitTitle: offerUnit,
        systemPrice: base,
        discountPercent: disc,
        discountAmount: discAmt,
        finalOfferPrice: base - discAmt,
        status: disc > 5 ? 'Approval Required' : 'Approved',
        justification: offerJustification || 'Standard commercial acquisition proposal.',
        requestedBy: 'Sarah Jenkins (Sales Dir)',
      });
      notify(`Offer generated for ${offerClient}!`);
    } else if (activeTab === 'rule') {
      if (!ruleName) {
        notify('Please specify a rule name');
        return;
      }
      onCreateRule({
        name: ruleName,
        scope: ruleScope,
        type: ruleType,
        adjustment: Number(ruleAdjustment) || 5,
        status: 'ACTIVE',
        affectedUnitsCount: 32,
      });
      notify(`Pricing Rule "${ruleName}" activated!`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">Create New Record</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add property inventory, offers, or dynamic rules</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selectors */}
        <div className="grid grid-cols-3 p-2 bg-slate-100 dark:bg-slate-950/60 gap-1 border-b border-slate-200 dark:border-slate-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('unit')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'unit'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Unit Inventory</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('offer')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'offer'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileSignature className="w-3.5 h-3.5" />
            <span>Commercial Offer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rule')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'rule'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Pricing Rule</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {activeTab === 'unit' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Unit Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AZ-T2-1804"
                    value={unitCode}
                    onChange={(e) => setUnitCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Project / Tower
                  </label>
                  <select
                    value={unitProject}
                    onChange={(e) => setUnitProject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:outline-hidden focus:border-blue-600"
                  >
                    <option>Azure Heights</option>
                    <option>Tower A - The Azure</option>
                    <option>The Zenith</option>
                    <option>Marina Bays</option>
                    <option>Horizon Tower</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Unit Type
                  </label>
                  <select
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:outline-hidden focus:border-blue-600"
                  >
                    <option>Studio</option>
                    <option>1 Bed</option>
                    <option>2 Bed + M</option>
                    <option>3 Bed / 2.5 Bath</option>
                    <option>4 Bed Penthouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Area (SQFT)
                  </label>
                  <input
                    type="number"
                    value={unitArea}
                    onChange={(e) => setUnitArea(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Base Price ($)
                  </label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'offer' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Customer / Company *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Corp Ltd."
                    value={offerClient}
                    onChange={(e) => setOfferClient(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Target Unit
                  </label>
                  <input
                    type="text"
                    value={offerUnit}
                    onChange={(e) => setOfferUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Requested Discount (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={offerDiscount}
                  onChange={(e) => setOfferDiscount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:outline-hidden focus:border-blue-600"
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Note: Discounts above 5.0% automatically trigger Director Approval Workflow.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Commercial Justification
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Fast closing corporate client acquiring bulk floorplate."
                  value={offerJustification}
                  onChange={(e) => setOfferJustification(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </>
          )}

          {activeTab === 'rule' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Rule Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marina View Surcharge"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Scope Target
                  </label>
                  <input
                    type="text"
                    value={ruleScope}
                    onChange={(e) => setRuleScope(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Calculation Type
                  </label>
                  <select
                    value={ruleType}
                    onChange={(e) => setRuleType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed Amount ($)</option>
                    <option value="Per Sqm">Per Sqm ($/sqm)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Adjustment Value
                </label>
                <input
                  type="number"
                  value={ruleAdjustment}
                  onChange={(e) => setRuleAdjustment(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-xs transition cursor-pointer"
            >
              Confirm & Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
