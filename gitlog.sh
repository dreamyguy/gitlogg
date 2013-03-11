git log --all --no-merges --shortstat --pretty=format:'commit_hash %H commit_hash_abbreviated %h tree_hash %T tree_hash_abbreviated %t parent_hashes %P parent_hashes_abbreviated %p author_email %ae author_date %ad author_date_unix_timestamp %at author_date_iso_8601 %ai committer_email %ce' | paste -d " " - - - | tail -r | awk -v q='"' -v c=':' -v cl='{' -v cr='}' -v bl='[' -v br=']' -v e=',' -v t='    ' '
BEGIN {
	print cl;
	print t q "commits" q c bl;
}
{
	count++;
	print t t cl;
	print t t t q "commit_nr" q c q count q e;
	print t t t q "commit_hash" q c q $2 q e;
	print t t t q "commit_hash_abbreviated" q c q $4 q e;
	print t t t q "tree_hash" q c q $6 q e;
	print t t t q "tree_hash_abbreviated" q c q $8 q e;
	if ( count == 1 ) {
		print t t t q "parent_hashes" q c q "" q e;
		print t t t q "parent_hashes_abbreviated" q c q "" q e;
		print t t t q "author_email" q c q $12 q e;
		print t t t q "date_day_week" q c q $14 q e;
		print t t t q "date_month_name" q c q $15 q e;
		print t t t q "date_month_day" q c q $16 q e;
		print t t t q "date_hour" q c q $17 q e;
		print t t t q "date_year" q c q $18 q e;
		print t t t q "date_hour_gmt" q c q $19 q e;
		print t t t q "author_date_unix_timestamp" q c q $21 q e;
		print t t t q "date_iso_8601" q c q $23 q e;
		print t t t q "committer_email" q c q $27 q e;
		print t t t q "files_changed" q c q $28 q e;
		print t t t q "insertions" q c q $31 q e;
		print t t t q "deletions" q c q $33 q e;
		print t t t q "impact" q c q $31 - $33 q;
	} else {
		print t t t q "parent_hashes" q c q $10 q e;
		print t t t q "parent_hashes_abbreviated" q c q $12 q e;
		print t t t q "author_email" q c q $14 q e;
		print t t t q "date_day_week" q c q $16 q e;
		print t t t q "date_month_name" q c q $17 q e;
		print t t t q "date_month_day" q c q $18 q e;
		print t t t q "date_hour" q c q $19 q e;
		print t t t q "date_year" q c q $20 q e;
		print t t t q "date_hour_gmt" q c q $21 q e;
		print t t t q "author_date_unix_timestamp" q c q $23 q e;
		print t t t q "date_iso_8601" q c q $25 q e;
		print t t t q "committer_email" q c q $29 q e;
		print t t t q "files_changed" q c q $30 q e;
		print t t t q "insertions" q c q $33 q e;
		print t t t q "deletions" q c q $35 q e;
		print t t t q "impact" q c q $33 - $35 q;
	}
	print t t cr e;
} END {
	print t br;
	print cr;
}' > gitlog.json