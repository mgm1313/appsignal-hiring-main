import dataFromGraphql from '@/data/graphql'
import MetadataDistributions from '@/components/MetadataDistributions'

export default function Home() {
    const { app: distributions } = dataFromGraphql

    return (
        <main className="bg-gray-50 py-12 min-w-full min-h-full">
            <MetadataDistributions distributions={distributions} />
        </main>
    )
}
