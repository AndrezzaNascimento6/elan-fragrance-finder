import { it,expect,vi } from 'vitest';
import { render,screen,act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App,{visitReducer} from '../../src/App';
import { loadCatalog } from '../../src/data/loadCatalog';
import { product,document as catalogDocument } from '../domain/fixtures';
import { normalizeCatalog } from '../../src/domain/catalog';
vi.mock('../../src/data/loadCatalog',()=>({loadCatalog:vi.fn()}));
it('shows real pending work then current results independently of images or motion',async()=>{
 let complete!:(c:ReturnType<typeof normalizeCatalog>)=>void;
 vi.mocked(loadCatalog).mockImplementation(()=>new Promise(resolve=>{complete=resolve;}));
 const user=userEvent.setup();render(<App/>);await user.click(screen.getByRole('button',{name:'Start discovering'}));
 for(const [i,answer] of ['Fresh','Everyday','Citrus','Light','Under $50'].entries()){
  await user.click(screen.getByRole('radio',{name:answer}));await user.click(screen.getByRole('button',{name:i===4?'Find my fragrances':'Continue'}));
 }
 expect(screen.getByRole('status')).toHaveTextContent('Finding fragrances');expect(screen.queryByRole('article')).not.toBeInTheDocument();
 await act(async()=>{complete(normalizeCatalog(catalogDocument([product()])));});
 expect(screen.getByRole('article')).toHaveTextContent('Morning Glass');expect(screen.getByRole('status')).toHaveTextContent('1 fragrance recommendations ready');
});
it('ignores obsolete result completions and clears previous products on a new request',()=>{
 const preferences={feeling:'fresh',occasion:'everyday',category:'citrus',intensity:'light',budget:'under-50'} as const;
 const state:Parameters<typeof visitReducer>[0]={view:'results',applied:preferences,requestId:1,catalogRevision:1,result:{status:'success',recommendations:[],diagnostics:catalogDocument([]).diagnostics},lastSuccess:null,error:'',editor:null,detail:null};
 const pending=visitReducer(state,{type:'request',id:2,preferences});expect(pending.result).toBeNull();
 expect(visitReducer(pending,{type:'resolve',id:1,result:{status:'empty',recommendations:[],diagnostics:catalogDocument([]).diagnostics}})).toBe(pending);
});

it('Home invalidates pending work and keyboard activation restores the introduction',async()=>{
 let complete!:(c:ReturnType<typeof normalizeCatalog>)=>void;
 vi.mocked(loadCatalog).mockImplementation(()=>new Promise(resolve=>{complete=resolve;}));
 const user=userEvent.setup();render(<App/>);await user.click(screen.getByRole('button',{name:'Start discovering'}));
 for(const [i,answer] of ['Fresh','Everyday','Citrus','Light','Under $50'].entries()){
  await user.click(screen.getByRole('radio',{name:answer}));await user.click(screen.getByRole('button',{name:i===4?'Find my fragrances':'Continue'}));
 }
 expect(screen.getByRole('status')).toHaveTextContent('Finding fragrances');
 screen.getByRole('link',{name:'Élan — Home'}).focus();await user.keyboard('{Enter}');
 expect(screen.getByRole('heading',{name:'Find the fragrance that feels like you'})).toHaveFocus();
 await act(async()=>{complete(normalizeCatalog(catalogDocument([product()])));});
 expect(screen.getByRole('heading',{name:'Find the fragrance that feels like you'})).toBeInTheDocument();expect(screen.queryByRole('article')).not.toBeInTheDocument();
});
