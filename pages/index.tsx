import dataFromGraphql from '@/data/graphql'
import MetadataDistributions from '@/components/MetadataDistributions'

export default function Home() {
    const { app: distributions } = dataFromGraphql

    return (
        <main className="bg-gray-50 py-12 min-w-full min-h-full">
            <div className="max-w-sm mx-auto">
                <MetadataDistributions distributions={distributions} />
            </div>

            <pre className="mt-12 text-xs">
                {JSON.stringify(distributions, null, 2)}
            </pre>
        </main>
    )
}
