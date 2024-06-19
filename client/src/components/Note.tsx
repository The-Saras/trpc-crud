// Note.tsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface NoteProps {
  title: string;
  content: string;
}

function Note (props: NoteProps) {
  return (
    <Card variant="outlined" sx={{ margin: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.content}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Note;
