import { AnimatePresence, motion } from "framer-motion";

type Props = {
    success: string;
    errors: string[];
};

export default function MessageBox({
    success,
    errors,
}: Props) {

    return (

        <AnimatePresence mode="wait">

            {success && (

                <motion.div
                    key="success"
                    className="success-box"
                    initial={{
                        opacity: 0,
                        y: -12,
                        scale: .95
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1
                    }}
                    exit={{
                        opacity: 0,
                        y: -10
                    }}
                >
                    ✅ {success}
                </motion.div>

            )}

            {!success && errors.length > 0 && (

                <motion.div
                    key="error"
                    className="error-box"
                    initial={{
                        opacity: 0,
                        y: -12,
                        scale: .95
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1
                    }}
                    exit={{
                        opacity: 0
                    }}
                >

                    {errors.map(error => (

                        <div key={error}>
                            ❌ {error}
                        </div>

                    ))}

                </motion.div>

            )}

        </AnimatePresence>

    );

}