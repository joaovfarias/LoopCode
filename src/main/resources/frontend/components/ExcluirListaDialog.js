import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

export default function ExcluirListaDialog({ open, onClose, lista }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Excluir Exercício</DialogTitle>
      <DialogContent>
        {/* conteúdo de edição */}
        <Typography>Tem certeza que deseja excluir a lista {lista.id}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='background'>Cancelar</Button>
        {/* botão de confirmação */}
        <Button onClick={onClose} color='error'>Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
}

