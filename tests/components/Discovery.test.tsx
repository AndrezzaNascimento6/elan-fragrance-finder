import { it,expect,vi } from 'vitest';
import { render,screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Discovery } from '../../src/views/Discovery';
it('requires an answer and preserves previous choices without auto-advance',async()=>{
 const user=userEvent.setup(),finish=vi.fn();render(<Discovery onComplete={finish}/>);
 expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
 await user.click(screen.getByRole('button',{name:'Continue'}));expect(screen.getByRole('alert')).toHaveTextContent('Choose');
 await user.click(screen.getByRole('radio',{name:'Fresh'}));expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
 await user.click(screen.getByRole('button',{name:'Continue'}));expect(screen.getByText('Question 2 of 5')).toBeInTheDocument();
 await user.click(screen.getByRole('radio',{name:'Work'}));await user.click(screen.getByRole('button',{name:'Back'}));expect(screen.getByRole('radio',{name:'Fresh'})).toBeChecked();
 await user.click(screen.getByRole('button',{name:'Continue'}));expect(screen.getByRole('radio',{name:'Work'})).toBeChecked();
 for(const answer of ['Work','Citrus','Light','Under $50']) {await user.click(screen.getByRole('radio',{name:answer}));await user.click(screen.getByRole('button',{name:/Continue|Find my fragrances/}));}
 expect(finish).toHaveBeenCalledWith({feeling:'fresh',occasion:'work',category:'citrus',intensity:'light',budget:'under-50'});
});

it('mobile uses intentional action buttons, keyboard activation and immediate advance with Back preservation',async()=>{
 const media=vi.spyOn(window,'matchMedia').mockImplementation(query=>({matches:query.includes('max-width'),media:query,onchange:null,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},dispatchEvent(){return true;}}));
 try{
  const finish=vi.fn(),user=userEvent.setup();render(<Discovery onComplete={finish}/>);
  expect(screen.queryByRole('button',{name:'Continue'})).not.toBeInTheDocument();
  expect(screen.getByText(/Choose an option to continue/)).toBeInTheDocument();
  const choose=(text:string)=>screen.getByRole('button',{name:new RegExp(`Choose ${text} and`)});
  choose('Fresh').focus();await user.keyboard('{ArrowRight}');expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();await user.keyboard('{Enter}');
  expect(screen.getByText('Question 2 of 5')).toBeInTheDocument();await user.click(choose('Work'));
  expect(screen.getByText('Question 3 of 5')).toBeInTheDocument();await user.click(screen.getByRole('button',{name:'Back'}));expect(choose('Work')).toHaveAccessibleName(/^Selected\./);
  await user.click(screen.getByRole('button',{name:'Back'}));expect(choose('Fresh')).toHaveAccessibleName(/^Selected\./);await user.click(choose('Fresh'));await user.click(choose('Work'));await user.click(choose('Citrus'));
  choose('Light').focus();await user.keyboard(' ');expect(screen.getByText('Question 5 of 5')).toBeInTheDocument();
  await user.click(screen.getByRole('button',{name:'Choose Under $50 and see fragrances'}));
  expect(finish).toHaveBeenCalledTimes(1);expect(finish).toHaveBeenCalledWith({feeling:'fresh',occasion:'work',category:'citrus',intensity:'light',budget:'under-50'});
 }finally{media.mockRestore();}
});
