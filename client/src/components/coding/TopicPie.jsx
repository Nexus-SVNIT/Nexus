import React, { useContext } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { DataContext } from "../data/dataContext";

const TopicPieChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { data } = useContext(DataContext);

    // Transform the data for the PieChart
    const pieData = data.reduce((acc, item) => {
        const existing = acc.find(d => d.id === item.topic);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ id: item.topic, label: item.topic, value: 1 });
        }
        return acc;
    }, []);

    return (
        <ResponsivePie
            data={pieData}
            theme={{
                axis: {
                    domain: {
                        line: {
                            stroke: colors.grey[100],
                        },
                    },
                    legend: {
                        text: {
                            fill: colors.grey[100],
                        },
                    },
                    ticks: {
                        line: {
                            stroke: colors.grey[100],
                            strokeWidth: 1,
                        },
                        text: {
                            fill: colors.grey[100],
                        },
                    },
                },
                tooltip: {
                    container: {
                        background: colors.primary[400],
                        color: colors.grey[100],
                        fontSize: 12,
                    },
                },
                legends: {
                    text: {
                        fill: colors.grey[100],
                    },
                },
            }}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor={colors.grey[100]}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            enableArcLabels={false}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
            defs={[
                { id: 'dots', type: 'patternDots', background: 'inherit', color: '#4fc3f7', size: 4, padding: 1, stagger: true },
                { id: 'lines', type: 'patternLines', background: 'inherit', color: '#76d275', rotation: -45, lineWidth: 6, spacing: 10 },
            ]}
            
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [{ on: 'hover', style: { itemTextColor: '#000' } }],
                },
            ]}
        />
    );
};

export default TopicPieChart;
