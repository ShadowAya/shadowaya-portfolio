import CodeGenerator from "@/utils/kustom-kompiler/codegen";
import { Token } from "@/utils/kustom-kompiler/lexer";
import Parser from "@/utils/kustom-kompiler/parser";
import { useEffect, useState } from "react";
import styles from './CompiledBlock.module.scss';
import Iconify from "../Iconify";

interface CompiledBlockProps {
    tokens: Token[] | null;
    lexedError: string | null;
}

export default function CompiledBlock({ tokens, lexedError }: CompiledBlockProps) {

    const [errors, setErrors] = useState<string[]>([]);
    const [compiled, setCompiled] = useState<string>('');

    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {

        if (!tokens) {
            return;
        }

        if (lexedError) {
            setErrors([lexedError]);
            return;
        }

        const parser = new Parser(tokens);
        const parsed = parser.parse();

        setErrors(parsed.errors);

        try {
            const gen = new CodeGenerator(parsed.nodes);
            const compiled = gen.generate();
            setCompiled(compiled);
        } catch (e) {
            setErrors([(e as any).message]);
        }

    }, [tokens]);

    return (
        <div
            className={styles.compiledBlock}
        >
            <div>
                <span>Compiled</span>
                <div />
                <button
                    onClick={() => setCollapsed(v => !v)}
                >
                    <Iconify
                        icon="fe:arrow-up"
                        height={24}
                        style={{
                            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                    />
                </button>
            </div>
            <code
                className={styles.errors}
                style={{
                    display: !collapsed && errors.length ? 'block' : 'none'
                }}
            >{errors.join('\n')}</code>
            <code
                style={{
                    display: !collapsed && !errors.length && compiled.length ? 'block' : 'none'
                }}
            >{compiled}</code>
            <button
                style={{
                    display: !collapsed && !errors.length && compiled.length ? 'block' : 'none'
                }}
            >
                <Iconify
                    icon="ph:copy-fill"
                    height={24}
                    onClick={() => navigator.clipboard.writeText(compiled)}
                />
            </button>
        </div>
    )

}