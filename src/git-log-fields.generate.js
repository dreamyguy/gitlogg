// Code generator: generates JS list of all git log fields

import {inspect} from 'util';
import * as fs from 'fs';
import * as Path from 'path';

import {groupBy, each} from 'lodash';

// Copy-pasted from https://git-scm.com/docs/pretty-formats, with all formatting-related codes removed.
const gitLogFieldDocs = `
'%H': commit hash

'%h': abbreviated commit hash

'%T': tree hash

'%t': abbreviated tree hash

'%P': parent hashes

'%p': abbreviated parent hashes

'%an': author name

'%aN': author name (respecting .mailmap, see git-shortlog[1] or git-blame[1])

'%ae': author email

'%aE': author email (respecting .mailmap, see git-shortlog[1] or git-blame[1])

'%ad': author date (format respects --date= option)

'%aD': author date, RFC2822 style

'%ar': author date, relative

'%at': author date, UNIX timestamp

'%ai': author date, ISO 8601-like format

'%aI': author date, strict ISO 8601 format

'%cn': committer name

'%cN': committer name (respecting .mailmap, see git-shortlog[1] or git-blame[1])

'%ce': committer email

'%cE': committer email (respecting .mailmap, see git-shortlog[1] or git-blame[1])

'%cd': committer date (format respects --date= option)

'%cD': committer date, RFC2822 style

'%cr': committer date, relative

'%ct': committer date, UNIX timestamp

'%ci': committer date, ISO 8601-like format

'%cI': committer date, strict ISO 8601 format

'%d': ref names, like the --decorate option of git-log[1]

'%D': ref names without the " (", ")" wrapping.

'%e': encoding

'%s': subject

'%f': sanitized subject line, suitable for a filename

'%b': body

'%B': raw body (unwrapped subject and body)

'%N': commit notes

'%GG': raw verification message from GPG for a signed commit

'%G?': show "G" for a good (valid) signature, "B" for a bad signature, "U" for a good signature with unknown validity, "X" for a good signature that has expired, "Y" for a good signature made by an expired key, "R" for a good signature made by a revoked key, "E" if the signature cannot be checked (e.g. missing key) and "N" for no signature

'%GS': show the name of the signer for a signed commit

'%GK': show the key used to sign a signed commit

'%gD': reflog selector, e.g., refs/stash@{1} or refs/stash@{2 minutes ago}; the format follows the rules described for the -g option. The portion before the @ is the refname as given on the command line (so git log -g refs/heads/master would yield refs/heads/master@{0}).

'%gd': shortened reflog selector; same as %gD, but the refname portion is shortened for human readability (so refs/heads/master becomes just master).

'%gn': reflog identity name

'%gN': reflog identity name (respecting .mailmap, see git-shortlog[1] or git-blame[1])

'%ge': reflog identity email

'%gE': reflog identity email (respecting .mailmap, see git-shortlog[1] or git-blame[1])

'%gs': reflog subject

// '%Cred': switch color to red
// 
// '%Cgreen': switch color to green
// 
// '%Cblue': switch color to blue
// 
// '%Creset': reset color
// 
// '%C(…​)': color specification, as described under Values in the "CONFIGURATION FILE" section of git-config[1]; adding auto, at the beginning will emit color only when colors are enabled for log output (by color.diff, color.ui, or --color, and respecting the auto settings of the former if we are going to a terminal). auto alone (i.e. %C(auto)) will turn on auto coloring on the next placeholders until the color is switched again.
// 
// '%m': left (<), right (>) or boundary (-) mark
// 
// '%n': newline
// 
// '%%': a raw '%'
// 
// '%x00': print a byte from a hex code
// 
// '%w([<w>[,<i1>[,<i2>]]])': switch line wrapping, like the -w option of git-shortlog[1].
// 
// '%<(<N>[,trunc|ltrunc|mtrunc])': make the next placeholder take at least N columns, padding spaces on the right if necessary. Optionally truncate at the beginning (ltrunc), the middle (mtrunc) or the end (trunc) if the output is longer than N columns. Note that truncating only works correctly with N >= 2.
// 
// '%<|(<N>)': make the next placeholder take at least until Nth columns, padding spaces on the right if necessary
// 
// '%>(<N>)', '%>|(<N>)': similar to '%<(<N>)', '%<|(<N>)' respectively, but padding spaces on the left
// 
// '%>>(<N>)', '%>>|(<N>)': similar to '%>(<N>)', '%>|(<N>)' respectively, except that if the next placeholder takes more spaces than given and there are spaces on its left, use those spaces
// 
// '%><(<N>)', '%><|(<N>)': similar to '% <(<N>)', '%<|(<N>)' respectively, but padding both sides (i.e. the text is centered)
`;

const fields = gitLogFieldDocs.split(/\r\n|\n/).filter(line => (
    line && line.indexOf('//') != 0
)).map(line => {
    const [, code, fullDescription, name, description] = line.match(/'(.*?)': ((.*?)((?:,|;| \(|$).*))/);
    return {
        code,
        name,
        fullDescription,
        description,
        identifier: name.replace(/ /g, '_')
    };
});

// For fields that end up with identical identifiers, give them longer, unique identifiers
each(groupBy(fields, 'identifier'), group => {
    if(group.length < 2) return;
    group.forEach(field => {
        field.identifier = field.fullDescription.replace(/[,;]? /g, '_');
    });
});

const output = `
export const fields = ${ inspect(fields) };
`;

fs.writeFileSync(Path.join(__dirname, 'git-log-fields.es'), output);