import { motion } from 'framer-motion';
import { useState } from 'react';

type GameMenuPageProps = {
    difficulty: number;
    setDifficulty: (difficulty: number) => void;
}
const GameMenuPage = ({ difficulty, setDifficulty }: GameMenuPageProps) => {


    const [animationCycle, setAnimationCycle] = useState(0);


    const handleSetDifficulty = (chosenDifficulty: number) => {
        setDifficulty(chosenDifficulty);
    }

    const ballVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: (i: number) => ({
            y: 0, 
            opacity: 1,
            transition: {
                delay: i * 0.8,
                type: 'spring',
                stiffness: 300,
                damping: 6,
                duration: 0.5
            }
        })
    };

    // Function to trigger the reset of the animation
    const triggerReset = () => {
        setAnimationCycle(cycle => cycle + 1); 
    };
    return (
        <div className="flex flex-col h-screen justify-center items-center">

            <div className='flex absolute top-10 z-10 gap-x-8 opacity-60'>
                {Array.from({ length: 12 }).map((_, index) => (
                    <motion.div
                        key={`${index}-${animationCycle}`} // Change key to reset animation
                        className={`h-40 w-40 rounded-full z-0 ${index % 2 === 0 ? 'bg-red-500' : 'bg-white border-2 border-neutral-500 shadow-xl'}`}
                        variants={ballVariants}
                        initial="hidden"
                        animate="visible"
                        onAnimationComplete={index === 11 ? triggerReset : undefined}
                        custom={index}
                    />
                ))}
            </div>
            <h1 className="text-[72px] font-bold my-8">Connect Four!</h1>
            <p className='text-[40px]'>Choose a difficulty to start the game</p>

            <div className="w-1/2 flex justify-between my-20">
                <button 
                onClick={() => handleSetDifficulty(1)}
                className="px-6 py-2 text-[40px] font-medium bg-[#f59300] text-white w-fit transition-all 
                shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] rounded-xl">
                    Easy
                </button>
                <button
                onClick={() => handleSetDifficulty(4)}
                className='px-6 py-2 text-[40px] font-medium bg-[#3661ff] text-white w-fit transition-all 
                shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] rounded-xl'>
                    Medium
                </button>
                <button 
                onClick={() => handleSetDifficulty(6)}
                className='px-6 py-2 text-[40px] font-medium bg-red-500 text-white w-fit transition-all 
                shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] rounded-xl'>
                    Hard
                </button>
            </div>
        </div>
    )
}

export default GameMenuPage;