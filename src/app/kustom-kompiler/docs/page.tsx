import styles from './page.module.scss'

export default function Page() {

    return (
        <section className={styles.parent}><div>
            <span className={styles.disclaimer}>Docs are a work in progress!</span>
            <h1>Kustom Kompiler</h1>
            <p>This tool compiles to Kustom expressions from a more familiar syntax</p>

            <h3>Output</h3>
            <p>Every expression that has a return value will be outputted. This includes plain strings and numbers.</p>
            <code>
                &quot;hello!&quot;;{"\n"}
                batteryInfo(&quot;charging&quot;);
            </code>
            <span className={styles.subtitle}>Output:</span>
            <code>
                hello!$bi(&quot;charging&quot;)$
            </code>

            <h3>Variables</h3>
            <p>Local variables are prefixed with <IC>#</IC>. They can be declared and read.</p>
            <code>
                #a = 5;{"\n"}
                #b = #a * 2;
            </code>
            <p>Global variables are prefixed with <IC>@</IC>. They can only be read.</p>
            <code>
                #b = @c * 2;
            </code>

            <h3>Conditions</h3>
            <p>Conditions are declared in the usual <IC>if else</IC> blocks.</p>
            <p>The <IC>else</IC> block is optional, single line expressions and <IC>else if</IC> are supported.</p>
            <code>
                if (#a == 5) {"{\n"}
                {"   "}&quot;hello!&quot;;
                {"\n}"}
            </code>
            <code>
                if (#a == 5) {"{\n"}
                {"   "}&quot;hello!&quot;;
                {"\n}"} else &quot;goodbye!&quot;;
            </code>
            <code>
                if (#a == 5) {"{\n"}
                {"   "}&quot;hello!&quot;;
                {"\n}"} else if (#a == 6) {"{\n"}
                {"   "}&quot;goodbye!&quot;;
                {"\n}"} else {"{\n"}
                {"   "}&quot;what?&quot;;
                {"\n}"}
            </code>

            <h3>Loops</h3>
            <p>Loops use a for block, they take a <IC>start</IC>, <IC>end</IC> and <IC>step</IC> arguments, separated by a semicolon.</p>
            <p>
                You have to increment <IC>i</IC> inside the <IC>step</IC> argument,
                and the iterator is then available inside the for block as a local variable <IC>#i</IC>
            </p>
            <p>You can optionally specify the <IC>separator</IC> in the next set of parenthesis before the block</p>
            <code>
                for (0; 10; i + 1) {"{\n"}
                {"   "}#i * 2;
                {"\n}"}
            </code>
            <code>
                for (0; 10; i + 1) (&quot;, &quot;) {"{\n"}
                {"   "}&quot;We are at &quot;;
                {"\n   "}#i;
                {"\n}"}
            </code>

            <h3>Functions</h3>
            <p>
                Each Kustom function has been mapped inside the linter.
                You will get the definition and argument suggestions as per the Kustom docs as you type
            </p>
            <p>
                Kustom functions are not very fit for a conventional language, as some of its middle arguments
                are optional/change as you type. To solve this, if you want to skip an argument, you can use the <IC>omit</IC> keyword.
                You don&apos;t have to use <IC>omit</IC> at all (as it&apos;s just ignored at output), but it helps with linting/readability.
            </p>
            <p>Rest arguments are prefixed with <IC>...</IC> and optional arguments are prefixed with <IC>*</IC></p>
            <code>
                batteryInfo(&quot;level&quot;);{"\n"}
                &quot;\n&quot;;{"\n"}
                systemNotification(&quot;com.whatsapp&quot;, omit, &quot;text&quot;);
            </code>
            <span className={styles.subtitle}>Output:</span>
            <code>
                $bi(&quot;level&quot;)$
                {"\n"}
                $ni(&quot;com.whatsapp&quot;, &quot;text&quot;)$
            </code>

        </div></section>
    )

}

function IC({ children }: { children: React.ReactNode }) {
    return <span className={styles.inlineCode}>{children}</span>
}