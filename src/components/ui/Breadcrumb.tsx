import Link from 'next/link';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex flex-wrap items-center gap-2 text-sm mb-8">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={index} className="flex items-center gap-2">
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="text-text-muted-light dark:text-text-muted-dark hover:text-golden-honey transition-colors font-medium"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={
                                    isLast
                                        ? 'text-text-light dark:text-text-dark font-medium'
                                        : 'text-text-muted-light dark:text-text-muted-dark font-medium'
                                }
                            >
                                {item.label}
                            </span>
                        )}
                        {!isLast && (
                            <span className="text-text-muted-light dark:text-text-muted-dark">/</span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
