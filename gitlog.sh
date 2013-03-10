git log --all --no-merges --shortstat --pretty=format:'commit_hash %H commit_hash_abbreviated %h tree_hash %T tree_hash_abbreviated %t parent_hashes %P parent_hashes_abbreviated %p author_email %ae author_date %ad author_date_unix_timestamp %at author_date_iso_8601 %ai committer_email %ce' | paste -d " " - - - | awk '{
	print "commit_hash " $2;
	print "commit_hash_abbreviated " $4;
	print "tree_hash " $6;
	print "tree_hash_abbreviated " $8;
	print "parent_hashes " $10;
	print "parent_hashes_abbreviated " $12;
	print "author_email " $14;
	print "date_day_week " $16;
	print "date_month_name " $17;
	print "date_month_day " $18;
	print "date_hour " $19;
	print "date_year " $20;
	print "date_hour_gmt " $21;
	print "author_date_unix_timestamp " $23;
	print "date_iso_8601 " $25;
	print "committer_email " $29;
	print "files_changed " $30;
	print "insertions " $33;
	print "deletions " $35;
	print "";
}' > gitlog.json