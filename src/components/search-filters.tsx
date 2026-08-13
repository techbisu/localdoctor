'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
export function SearchFilters({ specializations }: {
    specializations: any[];
}) { const router = useRouter(); const params = useSearchParams(); const updateFilter = (key: string, value: string) => { const newParams = new URLSearchParams(params.toString()); if (value) {
    newParams.set(key, value);
}
else {
    newParams.delete(key);
} router.push(`/search?${newParams.toString()}`); }; const currentType = params.get('type') || 'all'; return (<div className='space-y-6'>      <div>        <h3 className='font-semibold mb-3'>Provider Type</h3>        <div className='space-y-2'>          {['all', 'doctor', 'pharmacy', 'lab'].map((type) => (<div key={type} className='flex items-center gap-2'>              <Checkbox checked={currentType === type} onCheckedChange={() => updateFilter('type', type === 'all' ? '' : type)}/>              <Label className='text-sm cursor-pointer capitalize'>{type === 'all' ? 'All Providers' : type + 's'}</Label>            </div>))}        </div>      </div>      <Separator />      <div>        <h3 className='font-semibold mb-3'>Specialization</h3>        <div className='space-y-2 max-h-60 overflow-y-auto'>          {specializations.map((spec) => (<div key={spec.id} className='flex items-center gap-2'>              <Checkbox checked={params.get('specialization') === spec.slug} onCheckedChange={() => updateFilter('specialization', params.get('specialization') === spec.slug ? '' : spec.slug)}/>              <Label className='text-sm cursor-pointer'>{spec.name}</Label>            </div>))}        </div>      </div>    </div>); }
