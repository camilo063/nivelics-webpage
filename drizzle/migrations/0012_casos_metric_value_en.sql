-- casos_exito.metric_{1,2,3}_value_en: el valor de cada métrica en inglés.
-- Las etiquetas ya eran bilingües (metric_N_label_es/_en) pero el valor era uno solo y se
-- servía igual en /en, así que en la home inglesa se leía «+10 años» junto a "Long-term
-- partnership" y «<10 días» junto a "Team scaled". La columna nueva es opcional: cuando
-- está vacía, el mapper sigue usando el valor de siempre (cifras como «25%» o «+100» no
-- necesitan traducción).
ALTER TABLE "casos_exito" ADD COLUMN IF NOT EXISTS "metric_1_value_en" varchar(100);--> statement-breakpoint
ALTER TABLE "casos_exito" ADD COLUMN IF NOT EXISTS "metric_2_value_en" varchar(100);--> statement-breakpoint
ALTER TABLE "casos_exito" ADD COLUMN IF NOT EXISTS "metric_3_value_en" varchar(100);
