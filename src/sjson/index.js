import _SJSON from 'simplified-json';

const commentRegex = /\/\*([\s\S]*?)\*\/|([^\\:]|^)\/\/.*$/gm;

const SJSON = {
    stringify: _SJSON.stringify,
    parse: function (SJSONString) {
        const noCommentsSJSONString = SJSONString.replace(commentRegex, '');

        const parsed = _SJSON.parse(noCommentsSJSONString);

        return parsed;
    }
};

export { SJSON };
