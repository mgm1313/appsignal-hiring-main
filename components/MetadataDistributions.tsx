import Tooltip, { useSingleton } from '@/components/Tooltip'
import Link from 'next/link'
import { DataFromApi } from 'types/data'
import clsx from 'clsx'
import { colors } from 'utils/colors'

function BarSegment({
    className,
    label,
    value,
    total,
    target,
}: {
    className?: string
    label: string
    value: number
    total: number
    target: ReturnType<typeof useSingleton>[1]
}) {
    const fractionFormatter = new Intl.NumberFormat('en-US', {
        style: 'percent',
        maximumFractionDigits: 1,
    })

    return (
        <Tooltip
            content={`${label} (${fractionFormatter.format(value / total)})`}
            singleton={target}
        >
            <Link
                href="#"
                style={{
                    ['--segment-value' as string]: value,
                }}
                className={clsx(
                    className,
                    'h-full w-[calc(100%*(var(--segment-value)/var(--total-distribution-width)))]'
                )}
            >
                <span className="sr-only">{`${label}: ${value}`}</span>
            </Link>
        </Tooltip>
    )
}

function Bar({
    index,
    total,
    distributions,
}: {
    index: number
    total: number
    distributions: DataFromApi['app']['metadataDistributions'][number]['distributions']
}) {
    const colorGroup = colors[index % colors.length]

    // Extract first 9 distributions
    const visibleDistributions = distributions.slice(0, 9)
    // Group the rest of the distributions into one
    const restDistribution = distributions.slice(9)
    // Calculate the total value of the rest distribution
    const totalRestValue = restDistribution.reduce(
        (acc, { value }) => acc + value,
        0
    )

    // Use a singleton to share the same tooltip instance
    const [source, target] = useSingleton()

    return (
        <div
            className="flex rounded-full overflow-hidden h-2 w-full gap-x-px"
            style={{
                ['--total-distribution-width' as string]: total,
            }}
        >
            {/* We first iterate over the regular bar parts */}
            {visibleDistributions.map(({ key, value }, index) => {
                // @ts-expect-error - We know that the index is always a number between 0 and 8
                const bgColor = colorGroup[index]

                return (
                    <BarSegment
                        className={bgColor}
                        key={key}
                        label={key}
                        target={target}
                        total={total}
                        value={value}
                    />
                )
            })}

            {/* If there is only a 10th segment, we can add it just like a regular segment. */}
            {restDistribution.length === 1 ? (
                <BarSegment
                    className={colorGroup[9]}
                    label={restDistribution[0].key}
                    target={target}
                    total={total}
                    value={restDistribution[0].value}
                />
            ) : null}

            {/* Otherwise we cluster the remaining parts into one 'other' segment */}
            {restDistribution.length > 1 ? (
                <BarSegment
                    className={colorGroup[9]}
                    label={`${restDistribution.length} others...`}
                    target={target}
                    total={total}
                    value={totalRestValue}
                />
            ) : null}

            <Tooltip singleton={source} />
        </div>
    )
}

function MetadataDistribution({
    index,
    distribution,
}: {
    index: number
    distribution: DataFromApi['app']['metadataDistributions'][number]
}) {
    return (
        <div className={`px-6 pt-3.5 pb-4 flex flex-col gap-y-3`}>
            <h2 className="text-sm capitalize leading-none">{`${distribution.name} (${distribution.unique})`}</h2>
            <Bar
                index={index}
                distributions={distribution.distributions}
                total={distribution.total}
            />
        </div>
    )
}

export default function MetadataDistributions({
    distributions,
}: {
    distributions: DataFromApi['app']
}) {
    return (
        <div className="rounded border border-gray-300 bg-white divide-y divide-gray-300">
            <div className="flex justify-between text-sm items-center px-6 py-4">
                <h2 className="font-semibold">Metadata distributions</h2>
                <Link
                    href="#"
                    className="text-blue-600 hover:text-blue-900 underline"
                >
                    All attributes
                </Link>
            </div>

            {distributions.metadataDistributions.map((distribution, index) => (
                <MetadataDistribution
                    key={distribution.name}
                    index={index}
                    distribution={distribution}
                />
            ))}
        </div>
    )
}
