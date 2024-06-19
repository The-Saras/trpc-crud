import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { Alert, Button, TextField } from '@mui/material';

import Note from './components/Note';
import { trpc } from './utils/trpc';

function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      }
    }
  }));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000',

        }),
      ],
    }),
  );
  

  return (
    <>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Page/>
        <Notes/>
      </QueryClientProvider>
    </trpc.Provider>
      
    </>
  )
}

export function Notes(){
  const getnotesQuery = trpc.fetchNotes.useQuery();
  if(getnotesQuery.isLoading){
    return <div>Loading...</div>
  }
  return(
    <div>
      <h1>Notes</h1>
      {getnotesQuery.data?.map(x =>
        <Note key={x.id} title={x.title} content={x.content}/>
     )}
      
      
    </div>
  )

}

export function Page(){
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState(false);
  const noteQuery = trpc.createNote.useMutation({
    onSuccess: ()=>{
      console.log('Note added');
      setSuccess(true);
    },
    onError: (error)=>{
      console.log(error);
    }
  });
  return(

   
    <div>
      {success && <Alert severity="success">Note added successfully</Alert>}

      <TextField variant="outlined" label="Title" type="text" onChange={(e)=>{
        setTitle(e.target.value);
        }} /> <br></br>
      <TextField variant="outlined" label="Content" type="text" onChange={(e)=>{
        setContent(e.target.value);
        }} />
     
      <br></br>
      <Button variant='contained' onClick={()=>{
        noteQuery.mutate({
          title: title || '',
          content: content ||'',
          
          })
          
          }}>Add Note</Button>

        
    </div>
  )
}

export default App
