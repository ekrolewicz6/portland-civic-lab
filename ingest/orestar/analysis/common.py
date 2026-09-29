"""Versioned, conservative interpretations of current ORESTAR transaction records."""
from __future__ import annotations
import hashlib
import json
import re
import unicodedata
from datetime import datetime
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
START, END = "2025-01-01", "2026-09-27"
SNAPSHOT = "orestar-20250101-20260927-v1"
WORK = ROOT / "runtime-data/orestar-analysis" / SNAPSHOT
RESEARCH = ROOT / "research/campaign-finance"
PUBLIC = ROOT / "public/data/campaign-finance"
SEMANTICS_VERSION = "financial-bases-v1"
IDENTITY_VERSION = "conservative-fingerprints-v1"

# basis, direction relative to filing committee, cash effect. A debt event is
# never an additional cash expense. Reversals remain separate from gross flows.
SEMANTICS = {
    "Cash Contribution": ("cash_contribution", "in", 1),
    "Cash Expenditure": ("cash_payment", "out", -1),
    "In-Kind Contribution": ("noncash_support", "in", 0),
    "In-Kind/Forgiven Personal Expenditures": ("forgiven_obligation", "in", 0),
    "In-Kind/Forgiven Account Payable": ("forgiven_obligation", "in", 0),
    "Loan Received (Non-Exempt)": ("loan_received", "in", 1),
    "Loan Received (Exempt)": ("loan_received", "in", 1),
    "Loan Payment (Non-Exempt)": ("loan_payment", "out", -1),
    "Loan Payment (Exempt)": ("loan_payment", "out", -1),
    "Loan Forgiven (Non-Exempt)": ("loan_forgiven", "adjustment", 0),
    "Account Payable": ("obligation", "out", 0),
    "Personal Expenditure for Reimbursement": ("obligation", "out", 0),
    "Account Payable Rescinded": ("obligation_cancellation", "adjustment", 0),
    "Personal Expenditure Balance Adjustment": ("obligation_adjustment", "adjustment", 0),
    "Return or Refund of Contribution": ("contribution_refund", "out", -1),
    "Refunds and Rebates": ("other_cash_receipt", "in", 1),
    "Items Sold at Fair Market Value": ("other_cash_receipt", "in", 1),
    "Interest/Investment Income": ("other_cash_receipt", "in", 1),
    "Miscellaneous Other Receipt": ("other_cash_receipt", "in", 1),
    "Miscellaneous Other Disbursement": ("other_cash_payment", "out", -1),
    "Nonpartisan Activity": ("other_cash_payment", "out", -1),
    "Lost or Returned Check": ("cash_reversal", "adjustment", 1),
    "Cash Balance Adjustment": ("cash_adjustment", "adjustment", 1),
    "Miscellaneous Account Receivable": ("receivable", "in", 0),
}

def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()

def write_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(value, indent=2, ensure_ascii=False, default=str) + "\n")
    temp.replace(path)

def cents(value: str) -> int:
    value = value.strip().replace(",", "").replace("$", "")
    if value.startswith("(") and value.endswith(")"):
        value = "-" + value[1:-1]
    amount = Decimal(value)
    if not amount.is_finite() or amount * 100 != (amount * 100).to_integral_value():
        raise ValueError(f"Invalid cent amount: {value}")
    return int(amount * 100)

def iso(value: str) -> str | None:
    return datetime.strptime(value.strip(), "%m/%d/%Y").date().isoformat() if value.strip() else None

def norm(value: str) -> str:
    # No punctuation stripping or fuzzy merging: exact conservative variants.
    return re.sub(r"\s+", " ", unicodedata.normalize("NFKC", value).strip()).upper()

def aggregate_label(name: str) -> bool:
    return norm(name).startswith(("MISCELLANEOUS CASH CONTRIBUTIONS", "MISCELLANEOUS IN-KIND", "ANONYMOUS CONTRIBUTION", "MISCELLANEOUS CASH EXPENDITURES", "MISCELLANEOUS PERSONAL EXPENDITURES", "MISCELLANEOUS ACCOUNT PAYABLE", "MISCELLANEOUS LOST", "MISCELLANEOUS RETURN", "MISCELLANEOUS REFUND"))

def identity(row: dict) -> tuple[str, str]:
    name = row["Contributor/Payee"]
    # Test disclosure category before committee ID: malformed category IDs must
    # never create person nodes or bridges across committees.
    if aggregate_label(name):
        label_hash = hashlib.sha256(norm(name).encode()).hexdigest()[:12]
        return f"disclosure:{row['Filer Id']}:{label_hash}", "disclosure_category"
    if not name.strip():
        return f"unknown:{row['Tran Id']}", "unknown"
    if row["Contributor/Payee Committee ID"].strip():
        return "committee:" + row["Contributor/Payee Committee ID"].strip(), "authoritative_committee_id"
    fields = ["Contributor/Payee", "Book Type", "Addr Line1", "Addr Line2", "City", "State", "Zip", "Country"]
    fingerprint = json.dumps([norm(row[f]) for f in fields], ensure_ascii=False)
    return "record:" + hashlib.sha256(fingerprint.encode()).hexdigest()[:24], "provisional_record_group"

def concentration(values):
    values = sorted(v for v in values if v > 0)
    n, total = len(values), sum(values)
    if not total:
        return {"groups": n, "total_cents": total, "top1_share": None, "top10_share": None, "hhi": None, "effective_groups": None, "gini": None}
    hhi = sum((v / total) ** 2 for v in values)
    return {"groups": n, "total_cents": total, "top1_share": values[-1] / total, "top10_share": sum(values[-10:]) / total, "hhi": hhi, "effective_groups": 1 / hhi, "gini": 2 * sum((i + 1) * v for i, v in enumerate(values)) / (n * total) - (n + 1) / n}
