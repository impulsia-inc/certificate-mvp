'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { revokeCertificate, reactivateCertificate } from '@/features/certificates/actions/certificate.actions';
import { useRouter } from 'next/navigation';
import { Ban, RotateCcw } from 'lucide-react';

export function EditActions({ id, status }: { id: string; status: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isRevoked = status === 'revoked';

  const handleAction = async () => {
    setLoading(true);
    try {
      if (isRevoked) {
        await reactivateCertificate(id);
      } else {
        await revokeCertificate(id);
      }
      router.refresh();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'draft') return null;

  return (
    <>
      <Button 
        variant="outline" 
        className={isRevoked ? "text-green-600 hover:text-green-700" : "text-red-600 hover:text-red-700"}
        onClick={() => setOpen(true)}
      >
        {isRevoked ? <RotateCcw className="w-4 h-4 mr-2" /> : <Ban className="w-4 h-4 mr-2" />}
        {isRevoked ? 'Reactivar' : 'Revocar'}
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={isRevoked ? "¿Reactivar certificado?" : "¿Revocar certificado?"}
        description={isRevoked 
          ? "El certificado volverá a ser válido públicamente." 
          : "El certificado aparecerá como revocado y ya no será válido."}
        onConfirm={handleAction}
        isLoading={loading}
        destructive={!isRevoked}
      />
    </>
  );
}
