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
