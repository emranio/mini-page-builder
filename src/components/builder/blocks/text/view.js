import React from 'react';
import { Typography } from 'antd';
import { withBaseBlock } from '../../commons/base';
import { useBuilder } from '../../../../contexts/BuilderReducer';

const { Paragraph } = Typography;

const TextBlockView = ({
    id,
    content = 'Simple text block',
    fontSize = 14,
    fontWeight = 'normal',
    color = '#000000',
    textAlign = 'left',
    uniqueBlockId
}) => {
    const { setSelectedBlockId } = useBuilder();

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedBlockId(id);
    };

    return (
        <div id={uniqueBlockId}>
            <Paragraph
                className="text-block"
                onClick={handleClick}
            >
                {content || 'Simple text block'}
            </Paragraph>
        </div>
    );
};

export default withBaseBlock(TextBlockView, 'text');
