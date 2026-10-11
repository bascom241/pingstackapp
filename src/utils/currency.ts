const balanceKeys = ["balance", "availableBalance", "walletBalance", "amount", "value"] as const;

export const getBalanceAmount = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string") {
        const parsedValue = Number(value.replace(/,/g, ""));
        return Number.isFinite(parsedValue) ? parsedValue : null;
    }

    if (value && typeof value === "object") {
        const record = value as Record<string, unknown>;

        for (const key of balanceKeys) {
            const amount = getBalanceAmount(record[key]);

            if (amount !== null) {
                return amount;
            }
        }
    }

    return null;
};

export const formatNaira = (value: unknown): string => {
    const amount = getBalanceAmount(value) ?? 0;

    return new Intl.NumberFormat("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};